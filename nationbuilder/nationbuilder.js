// NationBuilder v2 API client.
//
// Endpoints/fields below were verified empirically against a live
// futureparty.nationbuilder.com test token on 2026-06-29 (see
// submissions/exit_survey.md and memory for the write-up) — notably:
//
//   - Auth is `Authorization: Bearer <token>`.
//   - filter[email] on /signups returns a 500 server error on this
//     instance; use filter[email1] instead (the underlying primary-email
//     column — email/email1/email2/email3/email4 all exist as separate
//     fields, "email" itself isn't filterable).
//   - Membership and fee tier are different things. /memberships rows
//     represent membership of a specific *party* (membership_type_id 2008
//     = "Fusion" on this nation; legacy types like Science/Secular/Vote
//     Planet/Pirate/Climate Justice still exist from the 2021 merger).
//     Cancelling is a PATCH to /memberships/{id} setting
//     status: "canceled" — NationBuilder then auto-computes expires_on.
//     This does NOT touch the separate Free/Concession/Standard/Sustaining
//     fee-tier concept.
//   - Tags are two steps: find-or-create a /signup_tags resource by name,
//     then POST a /signup_taggings resource linking signup_id + tag_id.
//   - The fee tier (Free/Concession/Standard/Sustaining) is NOT a field on
//     /memberships — it doesn't exist as a discrete resource anywhere in
//     v2 (membership_levels 404s, signup_profiles has no relevant field).
//     What NationBuilder actually tracks is a /donations row linked via
//     membership_id, with amount_in_cents recording what was paid — the
//     "tier" is purely our own application-level label for a given
//     amount. Creating a new paid membership is therefore three calls:
//     POST /signups (find-or-create), POST /memberships (status: active),
//     POST /donations (membership_id + amount_in_cents + page_id +
//     payment_type_id). Donations' `amount`/`status`/`succeeded_at`
//     fields are NOT directly writable — use `amount_in_cents` and let
//     NationBuilder set status/succeeded_at itself. This whole sequence
//     was tested end-to-end on a disposable test signup (created, verified,
//     then fully deleted) on 2026-06-29.
//
// The token used for verification was a 24-hour test token (Settings >
// Developer > API token) and was not stored anywhere in this repo. The
// production credential needs to be a proper long-lived OAuth token —
// check your nation's Settings > Developer for current options, since
// NationBuilder's public docs were unclear on long-lived token issuance
// at the time this was written.

function baseUrl(env) {
  return `https://${env.NATIONBUILDER_SLUG}.nationbuilder.com/api/v2`;
}

import { getAccessToken } from "./oauth.js";

async function authHeaders(env) {
  const token = await getAccessToken(env);
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function nbGet(env, path, params = {}) {
  const url = new URL(`${baseUrl(env)}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const res = await fetch(url.toString(), { headers: await authHeaders(env) });
  if (!res.ok) {
    throw new Error(`NationBuilder GET ${path} failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
  return res.json();
}

async function nbPost(env, path, body) {
  const res = await fetch(`${baseUrl(env)}${path}`, {
    method: "POST",
    headers: await authHeaders(env),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`NationBuilder POST ${path} failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
  return res.json();
}

async function nbPatch(env, path, body) {
  const res = await fetch(`${baseUrl(env)}${path}`, {
    method: "PATCH",
    headers: await authHeaders(env),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`NationBuilder PATCH ${path} failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
  return res.json();
}

export async function findSignupByEmail(env, email) {
  const body = await nbGet(env, "/signups", { "filter[email1]": email });
  return body?.data?.[0] || null;
}

export async function findFusionMembership(env, signupId) {
  const body = await nbGet(env, "/memberships", { "filter[signup_id]": signupId });
  const memberships = body?.data || [];
  const typeId = String(env.NATIONBUILDER_MEMBERSHIP_TYPE_ID || "2008");
  return memberships.find((m) => m.attributes.membership_type_id === typeId) || null;
}

export async function cancelMembership(env, membershipId, reasonLabel) {
  return nbPatch(env, `/memberships/${membershipId}`, {
    data: {
      type: "memberships",
      id: String(membershipId),
      attributes: { status: "canceled", status_reason: reasonLabel },
    },
  });
}

async function findOrCreateTag(env, name) {
  const found = await nbGet(env, "/signup_tags", { "filter[name]": name });
  if (found?.data?.length) return found.data[0].id;
  const created = await nbPost(env, "/signup_tags", {
    data: { type: "signup_tags", attributes: { name } },
  });
  return created.data.id;
}

export async function tagSignup(env, signupId, tagName) {
  const tagId = await findOrCreateTag(env, tagName);
  return nbPost(env, "/signup_taggings", {
    data: { type: "signup_taggings", attributes: { signup_id: signupId, tag_id: tagId } },
  });
}

// firstName/lastName/email/phone/dob/address are the legal-minimum fields
// from the existing native join page (see memory / README) — middleName,
// unit, and recruiter are optional. `declarations` is the five required
// checkboxes from that page; there's no dedicated field for three of
// them, so they're written as a timestamped note alongside the two that
// do have purpose-built custom_values fields (confirmed_at, accepted_at —
// confirmed writable empirically on 2026-06-29).
export async function findOrCreateSignup(env, {
  firstName, lastName, middleName, email, phone, dob,
  street, unit, suburb, postcode, state,
  recruiterId, recruiterHint, declarations,
}) {
  const existing = await findSignupByEmail(env, email);
  if (existing) return existing;

  const addressParts = [street, unit, suburb, state, postcode].filter(Boolean);

  const attributes = {
    first_name: firstName,
    last_name: lastName,
    email,
    email_opt_in: true,
  };
  if (middleName) attributes.middle_name = middleName;
  if (phone) {
    attributes.mobile_number = phone;
    attributes.phone_number = phone;
  }
  if (dob) attributes.born_at = dob;
  if (addressParts.length) attributes.submitted_address = addressParts.join(", ");

  if (recruiterId) {
    attributes.recruiter_id = Number(recruiterId);
  } else if (recruiterHint && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recruiterHint)) {
    const recruiter = await findSignupByEmail(env, recruiterHint);
    if (recruiter) attributes.recruiter_id = Number(recruiter.id);
  }

  const now = new Date().toISOString();
  if (declarations) {
    attributes.custom_values = {
      confirmed_at: declarations.electoralRoll ? now : null,
      accepted_at: declarations.codeOfConduct ? now : null,
    };
    attributes.note = [
      `Membership declarations confirmed at ${now}:`,
      `- Electoral roll details match: ${declarations.electoralRoll ? "yes" : "no"}`,
      `- Agreed to Code of Conduct: ${declarations.codeOfConduct ? "yes" : "no"}`,
      `- Declared not a current member of any other registered Australian political party: ${declarations.singleParty ? "yes" : "no"}`,
      `- Consented to being contacted to verify application: ${declarations.consentContact ? "yes" : "no"}`,
      `- Acknowledged false declaration is a serious offence: ${declarations.falseDeclaration ? "yes" : "no"}`,
      recruiterHint && !attributes.recruiter_id ? `- Recruiter hint (unresolved): ${recruiterHint}` : null,
    ].filter(Boolean).join("\n");
  }

  const created = await nbPost(env, "/signups", {
    data: { type: "signups", attributes },
  });
  return created.data;
}

export async function createMembershipOfType(env, signupId, typeId) {
  const created = await nbPost(env, "/memberships", {
    data: {
      type: "memberships",
      attributes: { signup_id: Number(signupId), membership_type_id: Number(typeId), status: "active" },
    },
  });
  return created.data;
}

export async function createActiveMembership(env, signupId) {
  const typeId = Number(env.NATIONBUILDER_MEMBERSHIP_TYPE_ID || "2008");
  return createMembershipOfType(env, signupId, typeId);
}

export async function recordMembershipDonation(env, { signupId, membershipId, amountCents }) {
  const pageId = Number(env.NATIONBUILDER_MEMBERSHIP_PAGE_ID || "3271");
  const paymentTypeId = Number(env.NATIONBUILDER_PAYMENT_TYPE_ID || "2"); // "Credit Card"
  const created = await nbPost(env, "/donations", {
    data: {
      type: "donations",
      attributes: {
        signup_id: Number(signupId),
        membership_id: Number(membershipId),
        page_id: pageId,
        amount_in_cents: amountCents,
        payment_type_id: paymentTypeId,
      },
    },
  });
  return created.data;
}

// Does the full resignation sync: find the signup, tag them, cancel their
// Fusion membership. Never throws — returns a result object so the caller
// can log failures without blocking the response to the member. By the
// time this runs, the Resend notice email (the legally important step)
// has already been sent, so a sync failure here just means a staff member
// needs to update NationBuilder by hand — it should never fail silently
// without that log line.
export async function syncResignation(env, { email, reasonLabel, reasonTag }) {
  try {
    const signup = await findSignupByEmail(env, email);
    if (!signup) {
      return { ok: false, reason: "no_matching_signup", email };
    }

    await tagSignup(env, signup.id, "resigned-via-survey");
    await tagSignup(env, signup.id, reasonTag);

    const membership = await findFusionMembership(env, signup.id);
    if (!membership) {
      return { ok: false, reason: "no_matching_membership", signupId: signup.id };
    }

    await cancelMembership(env, membership.id, reasonLabel);
    return { ok: true, signupId: signup.id, membershipId: membership.id };
  } catch (err) {
    return { ok: false, reason: "exception", error: String(err) };
  }
}

// Bare-minimum signup for newsletter-only opt-ins (footer form, no name/
// address collected). Unlike findOrCreateSignup, this never writes
// first_name/last_name — NationBuilder accepts an email-only signup. If the
// person already exists but previously opted out, flips email_opt_in back
// on rather than leaving it as-is.
async function findOrCreateNewsletterSignup(env, email) {
  const existing = await findSignupByEmail(env, email);
  if (existing) {
    if (existing.attributes?.email_opt_in) return existing;
    const patched = await nbPatch(env, `/signups/${existing.id}`, {
      data: {
        type: "signups",
        id: String(existing.id),
        attributes: { email_opt_in: true },
      },
    });
    return patched.data;
  }

  const created = await nbPost(env, "/signups", {
    data: { type: "signups", attributes: { email, email_opt_in: true } },
  });
  return created.data;
}

// Footer newsletter form entry point. Never throws — mirrors
// syncResignation's result-object pattern so the API route can log
// failures without blocking the response to the visitor.
export async function subscribeToNewsletter(env, email) {
  try {
    const signup = await findOrCreateNewsletterSignup(env, email);
    await tagSignup(env, signup.id, "newsletter-subscriber");
    return { ok: true, signupId: signup.id };
  } catch (err) {
    return { ok: false, reason: "exception", error: String(err) };
  }
}
