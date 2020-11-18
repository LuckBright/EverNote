import ruleTableMain from '../page/rule-table-main'
import ruleTreeMain from '../page/rule-tree-main'
import ruleVariableMain from '../page/variable-main'
import rulecConstantMain from '../page/constant-main'
import ruleSet from '../page/ruleset'

export default [
  {
    path: 'ruletable',
    name: 'ruletable',
    component: ruleTableMain,
  },
  {
    path: 'ruletree',
    name: 'ruletree',
    component: ruleTreeMain,
  },
  {
    path: 'variable',
    name: 'variable',
    component: ruleVariableMain,
  },
  {
    path: 'constant',
    name: 'constant',
    component: rulecConstantMain,
  },
  {
    path: 'ruleset',
    name: 'ruleset',
    component: ruleSet,
  }
]
