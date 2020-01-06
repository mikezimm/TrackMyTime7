import { ILinkRuleReturn, ISmartLinkDef, ILinkRule } from './ActivityURLMasks';
import { ITrackMyTime7Props } from '../ITrackMyTime7Props';


export const github : ISmartLinkDef = {
    host: 'https://github.com/',
    rules: [
        {
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

        },        {
            order: 100,
            ruleTitle: "Github Pull Request",  // Rule title
            keyFolder: '/pull/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: '#...x..., ', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentTextMapping: 'title, childFolderTitle, parentFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            activityDescMapping: 'childFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            category1Mapping: 'parentFolderTitle',
            category2Mapping: 'ruleTitle',
            projectID1Mapping: 'parentFolderTitle',
            projectID2Mapping: 'childFolderTitle',
        },        {
            order: 100,
            ruleTitle: "Github Branch",  // Rule title
            keyFolder: '/tree/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: ' ...x..., ', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentTextMapping: 'title, childFolderTitle, parentFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            activityDescMapping: 'childFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            category1Mapping: 'parentFolderTitle',
            category2Mapping: 'ruleTitle',
            projectID1Mapping: 'parentFolderTitle',
            projectID2Mapping: 'childFolderTitle',
        },        {
            order: 100,
            ruleTitle: "Github Project",  // Rule title
            keyFolder: '/projects/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: '', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentTextMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            activityDescMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            category1Mapping: 'parentFolderTitle',
            category2Mapping: 'ruleTitle',
            projectID1Mapping: '',
            projectID2Mapping: '',
        },        {
            order: 100,
            ruleTitle: "Github Wiki",  // Rule title
            keyFolder: '/wiki', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: 'Page: ', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentTextMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            activityDescMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            category1Mapping: 'parentFolderTitle',
            category2Mapping: 'ruleTitle',
            projectID1Mapping: '',
            projectID2Mapping: '',
        },        {
            order: 100,
            ruleTitle: "Github Commit",  // Rule title
            keyFolder: '/commit/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: ' #...x...,<<8<< ', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentTextMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            activityDescMapping: 'title, childFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            category1Mapping: 'parentFolderTitle',
            category2Mapping: 'ruleTitle',
            projectID1Mapping: 'parentFolderTitle',
            projectID2Mapping: 'childFolderTitle',
        },        {
            order: 100,
            ruleTitle: "",  // Rule title
            keyFolder: '/blob/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: ' in \'...x...\' Branch,', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: ' File: ', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' ^^^Repo: ...x...,', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: ' from User: ...x...:', // use 'na' to skip this rule.  '' to have no Title
            commentTextMapping: 'title, parentFolderTitle, childFolderTitle, keyFolder', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            activityDescMapping: 'title, parentFolderTitle, child2FolderTitle, childFolderTitle, parent2FolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            category1Mapping: 'child2FolderTitle',
            category2Mapping: 'childFolderTitle',
            projectID1Mapping: 'parentFolderTitle',
            projectID2Mapping: 'parent2FolderTitle',

        },
    ]

  }


