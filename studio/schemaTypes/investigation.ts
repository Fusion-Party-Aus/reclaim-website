import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'investigation', title: 'Public Investigation', type: 'document',
  groups: [{name:'editorial',title:'Editorial',default:true},{name:'evidence',title:'Evidence & Questions'},{name:'governance',title:'Review & Governance'}],
  fields: [
    defineField({name:'title',type:'string',group:'editorial',validation:r=>r.required()}),
    defineField({name:'slug',type:'slug',group:'editorial',options:{source:'title'},validation:r=>r.required()}),
    defineField({name:'summary',type:'text',rows:4,group:'editorial',validation:r=>r.required()}),
    defineField({name:'location',type:'string',group:'editorial'}),
    defineField({name:'projectStage',title:'Project stage',type:'string',group:'editorial',options:{list:['Early investigation','Planning','Consultation','Assessment','Approved','Under construction','Operational','Unknown']}}),
    defineField({name:'status',title:'Editorial status',type:'string',group:'governance',initialValue:'investigating',options:{list:[{title:'Investigating',value:'investigating'},{title:'Awaiting response',value:'awaiting-response'},{title:'Updated',value:'updated'},{title:'Closed',value:'closed'}]}}),
    defineField({name:'attribution',type:'string',group:'editorial'}),
    defineField({name:'editorialDisclaimer',type:'text',group:'editorial'}),
    defineField({name:'sourceReferences',type:'array',group:'evidence',of:[{type:'reference',to:[{type:'investigationSource'}]}]}),
    defineField({name:'body',type:'array',group:'editorial',of:[{type:'block'}]}),
    defineField({name:'evidence',title:'Source register',type:'array',group:'evidence',of:[{type:'object',fields:[
      {name:'title',type:'string',validation:r=>r.required()},
      {name:'url',type:'url',validation:r=>r.required().uri({scheme:['https','http']})},
      {name:'publisher',type:'string'},{name:'date',type:'date'},
      {name:'finding',type:'text',rows:3},{name:'limitations',type:'text',rows:2}
    ]}]}),
    defineField({name:'questions',title:'Public questions',type:'array',group:'evidence',of:[{type:'object',fields:[
      {name:'question',type:'text',rows:2,validation:r=>r.required()},
      {name:'status',type:'string',validation:r=>r.required(),options:{list:[{title:'Answered',value:'answered'},{title:'Partially answered',value:'partial'},{title:'Outstanding',value:'outstanding'}]}},
      {name:'provenance',type:'string',options:{list:['submitted','proposed','research']}},
      {name:'submittedOn',type:'date'},
      {name:'answer',type:'text',rows:3},{name:'evidenceUrls',type:'array',of:[{type:'url'}]},
      {name:'lastChecked',type:'date'},
      {name:'sources',type:'array',of:[{type:'reference',to:[{type:'investigationSource'}]}]}
    ]}]}),
    defineField({name:'updates',title:'Investigation updates',type:'array',group:'evidence',of:[{type:'object',fields:[
      {name:'date',type:'date',validation:r=>r.required()},{name:'headline',type:'string',validation:r=>r.required()},
      {name:'detail',type:'text',rows:3},{name:'sourceUrl',type:'url'},
      {name:'previousPosition',type:'text'},{name:'changeAssessment',type:'text'}
    ]}]}),
    defineField({name:'relatedInvestigations',type:'array',group:'evidence',of:[{type:'reference',to:[{type:'investigation'}]}]}),
    defineField({name:'editor',title:'Responsible editor',type:'string',group:'governance'}),
    defineField({name:'lastReviewed',type:'date',group:'governance'}),
    defineField({name:'reviewNotes',type:'text',group:'governance',description:'Internal only; not displayed publicly'}),
    defineField({name:'readyForPublication',type:'boolean',group:'governance',initialValue:false,description:'Editorial sign-off flag. Publication still requires explicit Sanity Publish.'}),
    defineField({name:'publishedAt',type:'datetime',group:'governance',description:'Public date; set on first approved publication'})
  ],
  preview:{select:{title:'title',subtitle:'status'}}
})
