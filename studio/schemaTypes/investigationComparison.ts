import {defineField,defineType} from 'sanity'
export default defineType({
 name:'investigationComparison',title:'Investigation Comparison',type:'document',
 fields:[
 defineField({name:'title',type:'string',validation:r=>r.required()}),
 defineField({name:'slug',type:'slug',options:{source:'title'},validation:r=>r.required()}),
 defineField({name:'summary',type:'text',rows:3,validation:r=>r.required()}),
 defineField({name:'investigations',type:'array',of:[{type:'reference',to:[{type:'investigation'}]}],validation:r=>r.min(2)}),
 defineField({name:'topics',title:'Comparison topics',type:'array',of:[{type:'object',fields:[
 {name:'topic',type:'string',validation:r=>r.required()},
 {name:'positions',title:'Per-project positions',type:'array',of:[{type:'object',fields:[
 {name:'investigation',type:'reference',to:[{type:'investigation'}]},
 {name:'finding',type:'text',rows:3},
 {name:'evidence',type:'array',of:[{type:'reference',to:[{type:'investigationSource'}]}]},
 {name:'limitations',type:'text',rows:2}
 ]}]},
 {name:'assessment',type:'text',rows:3},
 {name:'limitations',type:'text',rows:2}
 ]}]}),
 defineField({name:'lastReviewed',type:'date'}),
 defineField({name:'readyForPublication',type:'boolean',initialValue:false}),
 defineField({name:'publishedAt',type:'datetime'})
 ]})
