
import { sp } from '@pnp/sp';

export type IAnyArray = any[];

/**
 * https://stackoverflow.com/a/1527820
 * 
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Items to create when privisioning the list
 * 
 * NOTE:   Always make the first item in the object be text that can be used to verify if the item was added.
 * 
 */

export const TMTDefaultProjectItems  = [
    { Title: "Training", Everyone: true, Story: 'Training', Chapter: 'Yet more training :)', Category1: { results: ['Training']}},
    { Title: "Category Column Error - not in results", Everyone: true, Story: 'Webpart', Chapter: 'Example', ProjectID1: 'mask=B\\atch99999', ProjectID2: 'My prefix:...', Category1: 'TestWebpart'},
    { TitleX: "Title Column Error", Everyone: true, Story: 'Webpart', Chapter: 'Example', ProjectID1: 'mask=B\\atch99999', ProjectID2: 'My prefix:...', Category1: { results: ['TestWebpart']}},
    { Title: "Email triage", Everyone: true, Story: 'Daily', Chapter: 'Email triage', Category1: { results: ['Daily']}},
    { Title: "Break", Everyone: true, Story: 'Daily', Chapter: 'Break', Category1: { results: ['Daily']}},
    { Title: "Team Meeting", Everyone: true, Story: 'Meetings', Chapter: 'Team Meeting', Category1: { results: ['Meetings']}},
    { Title: "Example for Mask and Prefix in ProjectID columns", Everyone: true, Story: 'Webpart', Chapter: 'Example', ProjectID1: 'mask=B\\atch99999', ProjectID2: 'My prefix:...', Category1: { results: ['TestWebpart']}},

];

function createRandomTimeEntry(qty, user = null){

    let allItems : IAnyArray = [];

    const stories = ['Story A', 'Story B', 'Story C',null];
    const chapters = ['Chapter 1', 'Chapter 2', 'Chapter 3','Chapter 4', 'Chapter 5', 'Chapter 6',null];
    const category1s = ['Cat A', 'Cat B', 'Cat C']; 
    const category2s = ['Cat 1', 'Cat 2', 'Cat 3'];
    const entryTypes = ['manual','sinceLast','slider','start'];

    for (let i = 0; i < qty ; i++) {
        let thisStory = getRandomFromArray(stories);
        let thisChapter = getRandomFromArray(chapters);

        let start = randomDate(new Date(2020, 0, 1), new Date());
        let randomMinutes = getRandomInt(20, 180) * 60 * 1000;
        let end = new Date(start.getTime() + randomMinutes);

        //Based on intial testing, ID 1 is an account, not a name, ID 2 Title is empty.
        let thisUser = user === null ? getRandomInt(3,8) : user;

        allItems.push({
            Title: 'Test for user: ' + thisUser + ' - ' + thisStory + ' - ' + thisChapter + ' # ' + i,
            UserId: thisUser,
            ProjectID1: 'Proj1: ' + getRandomInt(1,50),
            ProjectID2: 'Proj2: ' + getRandomInt(200,300),
            Story: thisStory,
            Chapter: thisChapter,
            StartTime: start.toLocaleString(),
            EndTime: end.toLocaleString(),
            Category1: { results: [getRandomFromArray(category1s)]},
            Category2: { results: [getRandomFromArray(category2s)]},
            EntryType: getRandomFromArray(entryTypes),
            OriginalStart: start.toLocaleString(),
            OriginalEnd: end.toLocaleString(),
            OriginalHours: randomMinutes / (60000 * 60),

        });
    }
    return allItems;
}

export function TMTTestTimeItems(currentUser){

    let allItems = createRandomTimeEntry( 10, null);
    let userItems = createRandomTimeEntry( 20, currentUser.Id);
    let returnItems = allItems.concat(userItems);
    console.log('TMTTestTimeItems:', returnItems);
    return returnItems;

} 

