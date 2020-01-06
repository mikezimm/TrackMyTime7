import { ITrackMyTime7State } from '../ITrackMyTime7State';
import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { github } from './GithubRules';
import { sharePointOnline } from './SharePointOnlineRules';
//import { sharePointOnPrem } from './sharePointOnPremRules';
import { serviceNow } from './ServiceNowRules';
import { jira } from './JiraRules';


export interface ILinkRuleReturn {
    /**
     *  These are the properties that define how to build up the designated fields
     */

    // These are the fields that can be auto-populated based on SmartLink mapping
    commentText?: string; // This will go into the Comments field
    activityDesc?: string; // This will be the description or visible text in the Activity URL field
    category1?: string;  // This is the value for this column
    category2?: string;  // This is the value for this column
    projectID1?: string;  // This is the value for this column
    projectID2?: string;  // This is the value for this column

}

export interface ILinkRule extends ILinkRuleReturn {

    order: number;  // To be used for sorting priority of rule
    ruleTitle: string;  // Rule title

    /**  These are the parts of the URL that can turned into strings.
     *      Examples of different syntax options
     *       
     *      1)  use ' Any text to be the prefix of the folder name value' to insert folder value in middle of string
                childFolderTitle: ' in \'...x...\' Branch,',
                comment fragment:  " in 'master' Branch,"

    *      2)  use ...x... to insert folder value in middle of string
                childFolderTitle: ' in \'...x...\' Branch,',
                comment fragment:  " in 'master' Branch,"

    *      3)  insert ^^^ in string to make the folder name all UPPERCASE
                childFolderTitle: '^^^ in \'...x...\' Branch,',
                comment fragment:  " in 'MASTER' Branch,"

    *      4)  insert vvv in string to make the folder name all lowercase
                childFolderTitle: ' in \'...x...\' Branch,',
                comment fragment:  " in 'master' Branch,"

     */
    
    keyFolder: string; // Key folder in URL to apply rule too ( like /issues/ )
    childFolderTitle?: string; // use 'na' to skip this rule.  '' to have no Title.  Last character is spacer
    child2FolderTitle?: string; // use 'na' to skip this rule.  '' to have no Title.  Last character is spacer
    parentFolderTitle?: string; // use 'na' to skip this rule.  '' to have no Title.  Last character is spacer
    parent2FolderTitle?: string; // use 'na' to skip this rule.  '' to have no Title.  Last character is spacer

    /**
     *  These are the properties that define how to build up the designated fields
     */
    // These are the fields that can be auto-populated based on SmartLink mapping
    commentTextMapping?: string; // This will go into the Comments field
    activityDescMapping?: string; // This will be the description or visible text in the Activity URL field
    category1Mapping?: string;  // This is the value for this column
    category2Mapping?: string;  // This is the value for this column
    projectID1Mapping?: string;  // This is the value for this column
    projectID2Mapping?: string;  // This is the value for this column

}

export interface ISmartLinkDef {

    host: string;
    rules: ILinkRule[];

}

export function buildSmartLinkRules(parentProps: ITrackMyTime7Props) {
  
    let smartLinkRules: ISmartLinkDef[]=[];
    
    smartLinkRules.push(github);
    smartLinkRules.push(sharePointOnline(parentProps));
    smartLinkRules.push(serviceNow());
    smartLinkRules.push(jira());
//    smartLinkRules.push(sharePointOnPrem());
    

    return smartLinkRules;
    
}


export function convertSmartLink(link : string, smartLinkRules: ISmartLinkDef[]){

    //let host = getHostRules(link,rules);
    let result : ILinkRuleReturn = null;
    if (link.length === 0 ) { return result; }

    let host: ISmartLinkDef = getHost(link,smartLinkRules);
    if (host === null) { return result; }

    let rule: ILinkRule = getHostRule(link,host.rules);
    if (rule === null) { return result; }

    if (rule) { 
        result = applyHostRule(link,rule);
    }

    return result;

}

function applyHostRule(link : string, rule: ILinkRule) {

    link = link;
    let result : ILinkRuleReturn = null;

    let split = link.split(rule.keyFolder);
    let parents = split[0].split('/');
    let children = split[1].split('/');
    //This will update the ruleSet with actual values based on the link.
    let rule2: ILinkRule = updateRuleLabels(link, rule, parents, children);

    let commentText = getTextFromLink(rule2.commentTextMapping, rule2);
    console.table('getHostRuleApplication: commentText', commentText);

    let activityDesc = getTextFromLink(rule2.activityDescMapping, rule2);
    console.table('getHostRuleApplication: activityDesc', activityDesc);

    let category1 = getTextFromLink(rule2.category1Mapping, rule2);
    let category2 = getTextFromLink(rule2.category2Mapping, rule2);
    let projectID1 = getTextFromLink(rule2.projectID1Mapping, rule2);
    let projectID2 = getTextFromLink(rule2.projectID2Mapping, rule2);

    result = {
        commentText: commentText,
        activityDesc: activityDesc,
        category1: category1,
        category2: category2,
        projectID1: projectID1,
        projectID2: projectID2,
    };

    console.log('result: ', result);
    return result;
}

function updateRuleLabels(link : string, rule: ILinkRule, parents: string[], children: string[]) {

    let rule2 = <ILinkRule>{};
    rule2 = JSON.parse(JSON.stringify(rule));
    rule2.childFolderTitle = updateFolderLabels(rule.childFolderTitle, 1,  rule, parents, children);
    rule2.child2FolderTitle = updateFolderLabels(rule.child2FolderTitle, 2, rule, parents, children);
    rule2.parentFolderTitle = updateFolderLabels(rule.parentFolderTitle, -1, rule, parents, children);
    rule2.parent2FolderTitle = updateFolderLabels(rule.parent2FolderTitle, -2, rule, parents, children);

    console.log('rule2:', rule2);

    return rule2;

}

function updateFolderLabels(FolderDefinition: string, FolderIndex: number, rule: ILinkRule, parents: string[], children: string[]){
/**
 * Goal of this function is to take the definition and the folder, and return a new Folder Label
 * childFolderTitle: '#...x..., ', // use 'na' to skip this rule.  '' to have no Title
 * 
 * would return
 * childFolderTitle: '#33, ', // use 'na' to skip this rule.  '' to have no Title
 */
    let result = '';

    if ( FolderDefinition && FolderDefinition !== 'na' ) {//This is a valid mapping
        
        let toUpperCase = FolderDefinition.indexOf('^^^') > -1 ? true : false;
        let toLowerCase = FolderDefinition.indexOf('vvv') > -1 ? true : false;
        let toProperCase = FolderDefinition.indexOf('^v') > -1 ? true : false;

        let prefix = FolderDefinition.split('...x...')[0];
        prefix = prefix ? prefix.replace('...x...','') : prefix;

        let suffix = FolderDefinition.split('...x...')[1];
        suffix = suffix ? suffix.replace('...x...','') : suffix;

        let thisText: string = '';
        
        if (FolderIndex < 0 ) { //This is a parent
            if (parents.length < FolderIndex) { // folder does not exist in URL
            } else {

                thisText = parents[parents.length + FolderIndex];

                if (toUpperCase) { thisText = thisText.toLocaleUpperCase(); }
                else if (toLowerCase) { thisText = thisText.toLocaleLowerCase(); }
                //else if (toProperCase) { thisText = thisText.toProperCase() }

                thisText = prefix ? prefix + thisText : thisText;
                thisText = suffix ? thisText + suffix : thisText;
            }
        } else if (FolderIndex > 0 ) { //This is a child
            if (children.length < FolderIndex) { // folder does not exist in URL
            } else {

                thisText = children[FolderIndex - 1];

                if (toUpperCase) { thisText = thisText.toLocaleUpperCase(); }
                else if (toLowerCase) { thisText = thisText.toLocaleLowerCase(); }
                //else if (toProperCase) { thisText = thisText.toProperCase() }

                thisText = prefix ? prefix + thisText : thisText;
                thisText = suffix ? thisText + suffix : thisText;
            }
        }
        thisText = thisText.replace('^^^','').replace('vvv','').replace('^v','');

        //This will trim the length of the total value (including label) to the length between 2 sets of << like <<8<<
        let shorten = thisText.split('<<');
        if (shorten.length === 3) {
            thisText = shorten[0] + shorten[2];
            if (thisText.length > parseInt(shorten[1])) {
                thisText = thisText.substr(0, parseInt(shorten[1]) ) + '...';
            }
        }

        result += thisText;
    }

    // Remove any last commas, spaces, colons and semi colons
    //https://stackoverflow.com/a/17720342/4210807
    result = result.replace(/\s*$/, "").replace(/,*$/, "").replace(/;*$/, "").replace(/:*$/, "");

    return result;
}


function getTextFromLink(columMapping: string, rule: ILinkRule){

    let result = columMapping;

    result = result.replace('keyFolder', rule.keyFolder);
    result = result.replace('ruleTitle', rule.ruleTitle);
    result = result.replace('childFolderTitle', rule.childFolderTitle);
    result = result.replace('child2FolderTitle', rule.child2FolderTitle);
    result = result.replace('parentFolderTitle', rule.parentFolderTitle);
    result = result.replace('parent2FolderTitle', rule.parent2FolderTitle);

    // Remove any last commas, spaces, colons and semi colons
    //https://stackoverflow.com/a/17720342/4210807
    result = result.replace(/\s*$/, "").replace(/,*$/, "").replace(/;*$/, "").replace(/:*$/, "");

    return result;
}


function getTextFromLinkPre48(definition: string, rule: ILinkRule, parents: string[], children: string[]){

    let structure = definition.replace(/, /g,',').split(',');

    let result = '';
    for (let member of structure) {

        if ( rule[member] && rule[member] !== 'na' ) {//This is a valid mapping
            let index = getFolderIndex(member);
            
            let toUpperCase = rule[member].indexOf('^^^') > -1 ? true : false;
            let toLowerCase = rule[member].indexOf('vvv') > -1 ? true : false;
            let toProperCase = rule[member].indexOf('^v') > -1 ? true : false;

            let prefix = rule[member].split('...x...')[0];
            prefix = prefix ? prefix.replace('...x...','') : prefix;

            let suffix = rule[member].split('...x...')[1];
            suffix = suffix ? suffix.replace('...x...','') : suffix;

            let thisText: string = '';

            if ( member === 'title') {
                thisText = rule[member];

            } else if ( member === 'keyFolder') {
                thisText = rule[member];

            } else if (index < 0 ) { //This is a parent
                if (parents.length < index) { // folder does not exist in URL
                } else {

                    thisText = parents[parents.length + index];

                    if (toUpperCase) { thisText = thisText.toLocaleUpperCase(); }
                    else if (toLowerCase) { thisText = thisText.toLocaleLowerCase(); }
                    //else if (toProperCase) { thisText = thisText.toProperCase() }

                    thisText = prefix ? prefix + thisText : thisText;
                    thisText = suffix ? thisText + suffix : thisText;
                }
            } else if (index > 0 ) { //This is a child
                if (children.length < index) { // folder does not exist in URL
                } else {

                    thisText = children[index - 1];

                    if (toUpperCase) { thisText = thisText.toLocaleUpperCase(); }
                    else if (toLowerCase) { thisText = thisText.toLocaleLowerCase(); }
                    //else if (toProperCase) { thisText = thisText.toProperCase() }

                    thisText = prefix ? prefix + thisText : thisText;
                    thisText = suffix ? thisText + suffix : thisText;
                }
            }
            thisText = thisText.replace('^^^','').replace('vvv','').replace('^v','');

            //This will trim the length of the total value (including label) to the length between 2 sets of << like <<8<<
            let shorten = thisText.split('<<');
            if (shorten.length === 3) {
                thisText = shorten[0] + shorten[2];
                if (thisText.length > parseInt(shorten[1])) {
                    thisText = thisText.substr(0, parseInt(shorten[1]) ) + '...';
                }
            }

            result += thisText;
        }
    }
    // Remove any last commas, spaces, colons and semi colons
    //https://stackoverflow.com/a/17720342/4210807
    result = result.replace(/\s*$/, "").replace(/,*$/, "").replace(/;*$/, "").replace(/:*$/, "");

    return result;
}


function makeProperCaseString(str: string) {
// Unable to get this to work :()
//https://stackoverflow.com/a/51181225/4210807
    /*
    str = "hEllo billie-ray o'mALLEY-o'rouke.Please come on in.";
    String.prototype.initCap = function () {
    return this.toLowerCase().replace(/(?:^|\b)[a-z]/g, function (m) {
        return m.toUpperCase();
    });
    };
    alert(str.initCap());
    */

}

function getFolderIndex(member) {

    if ( member === 'parent2FolderTitle' ) { return -2; }
    if ( member === 'parentFolderTitle' ) { return -1; }
    if ( member === 'childFolderTitle' ) { return 1; }
    if ( member === 'child2FolderTitle' ) { return 2; }
    if ( member === 'title' ) { return null; }
    if ( member === 'keyFolder' ) { return null; }
    

    console.table('getFolderIndex error, member not recognized:', member);

    return 0;
    
}
function getHostRule(link : string, rules: ILinkRule[]) {

    link = link.toLowerCase();
    let result : ILinkRule = null;

    for (let rule of rules) {

        let keyFolder = rule.keyFolder.toLowerCase();
        let indexOf = link.indexOf(keyFolder);
        if ( indexOf > 0 ) {
            result = rule;
            console.table('getHostRule:', result);
            return result;
        }
    }
    console.table('getHostRule:', result);
    return result;
}

function getHost(link : string, hosts: ISmartLinkDef[]) {

    link = link.toLowerCase();
    let result : ISmartLinkDef = null;

    for (let host of hosts) {
        let hostName = host.host.toLowerCase();
        if ( link.indexOf(hostName) === 0 ) {
            result = host;
            return result;
        }
    }
    console.table('getHost:', result);
    return result;
}


