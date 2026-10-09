import {defineField,defineType} from 'sanity'
export default defineType({
 name:'investigationIssue',title:'Cross-project Issue',type:'document',
 fields:[
 defineField({name:'title',type:'string',validation:r=>r.required()}),
 defineField({name:'slug',type:'slug',options:{source:'title'},validation:r=>r.required()}),
 defineField({name:'summary',type:'text',rows:4,validation:r=>r.required()}),
 defineField({name:'investigations',type:'array',of:[{type:'reference',to:[{type:'investigation'}]}]}),
 defineField({name:'findings',type:'array',of:[{type:'object',fields:[
 {name:'investigation',type:'reference',to:[{type:'investigation'}]},
 {name:'finding',type:'text',rows:3},
 {name:'evidence',type:'array',of:[{type:'reference',to:[{type:'investigationSource'}]}]},
 {name:'limitations',type:'text',rows:2}
 ]}]}),
 defineField({name:'cumulativeImpactCaveat',title:'Comparability / cumulative impact caveat',type:'text',rows:3}),
 defineField({name:'nextSteps',type:'text',rows:3}),
 defineField({name:'lastReviewed',type:'date'}),
 defineField({name:'readyForPublication',type:'boolean',initialValue:false}),
 defineField({name:'publishedAt',type:'datetime'})
 ]})
