import { ILinkRuleReturn, ISmartLinkDef, ILinkRule } from './ActivityURLMasks';
import { ITrackMyTime7Props } from '../ITrackMyTime7Props';

/**
 * Example from github 
 * {
    order: 100,
    ruleTitle: "Github Issue ",  // Rule title

    keyFolder: '/issues/', // Key folder in URL to apply rule too ( like /issues/ )
    childFolderTitle: '#...x..., ', // use 'na' to skip this rule.  '' to have no Title
    child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
    parentFolderTitle: ' really long word ', // use 'na' to skip this rule.  '' to have no Title
    parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title

    commentTextMapping: 'title, childFolderTitle, parentFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
    activityDescMapping: 'childFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
    category1Mapping: 'parentFolderTitle',
    category2Mapping: 'ruleTitle',
    projectID1Mapping: 'parentFolderTitle',
    projectID2Mapping: 'childFolderTitle',
 * }

 */

  export function Model(parentProps: ITrackMyTime7Props)  {

    let ModelX : ISmartLinkDef = {
        host: 'parentProps.tenant',
        rules: [
    
        ]
    };
    return ModelX;

}

