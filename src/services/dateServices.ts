

import { IUser} from '../webparts/trackMyTime7/components/ITrackMyTime7State';


export const msPerMin = 60000;
export const msPerHr = 3600000;
export const msPerDay = 86400000;
export const msPerWk = 604800000;
export const msPerMo = 2678400000;
export const msPerQ = 7776000000;
export const msPerYr = 31536000000;

export const monthStr = {
  'en-us':["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'de': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'fr': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'es': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'ja': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'ch': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'ko': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'thai': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'swe': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

};


export const weekday = {
  'en-us':["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'de': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'fr': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'es': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'ja': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'ch': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'ko': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'thai': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'swe': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

};

export interface ITheTime {
  now: Date;
  theTime : string;
  milliseconds : number;
  year?: number;
  month?: number; //Zero Index
  monthStr?: string;
  week?: number;
  day?: number;
  date?: number;
  dayStr?: string;
  hour?: number;
  isToday?: boolean;
  isYesterday?: boolean;
  isThisWeek?: boolean;
  isThisMonth?: boolean;
  isThisYear?: boolean;
  daysAgo?: number;
  isoWeek?: number;

}


//https://www.w3resource.com/javascript-exercises/javascript-date-exercise-24.php
export function ISO8601_week_no(dt) 
  {
    var tdt = new Date(dt.valueOf());
    var dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    var firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) 
      {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
        }
    return 1 + Math.ceil((firstThursday - tdt.valueOf()) / 604800000);
  }


  //This is a more detailed version of the time object for charting purposes
export function makeTheTimeObject(timeString) {

  //console.log('makeTimeObject: ', timeString);
  let rightNow = new Date();

  let todayYear = rightNow.getFullYear();
  let todayMonth = rightNow.getMonth() ; //Zero Index
  let todayWeek = ISO8601_week_no(rightNow);
  let todayDate = rightNow.getDate();
  let todayDay = rightNow.getDay();

  let todayTime = rightNow.getTime() ;
  let todayHour = rightNow.getHours() ;


  let giveTime = new Date();

  if (timeString ) { giveTime = new Date(timeString);}

  let givenYear = giveTime.getFullYear();
  let givenMonth = giveTime.getMonth() ; //Zero Index
  let givenWeek = ISO8601_week_no(giveTime);
  let givenDate = giveTime.getDate();
  let givenDay = giveTime.getDay();

  let givenTime = giveTime.getTime() ;
  let givenHour = giveTime.getHours() ;

  let isThisYear = todayYear === givenYear ? true : false;
  let isThisMonth = isThisYear && todayMonth === givenMonth ? true : false;
  let isThisWeek = isThisYear && givenWeek === todayWeek ? true : false;
  let isToday = isThisMonth && todayDate === givenDate ? true : false;


  let daysAgo = Math.round(Math.abs((rightNow.getTime() - giveTime.getTime()) / msPerDay));

  let theTime : ITheTime = {
    now: giveTime,
    theTime: giveTime.toUTCString(),
    milliseconds: giveTime.getTime(),
    year: givenYear,
    month: givenMonth,
    week: givenWeek,
    date: givenDate,
    day: givenDay,
    hour: givenHour,

    isThisYear: isThisYear,
    isThisMonth: isThisMonth,
    isThisWeek: isThisWeek,
    isToday: isToday,
    isYesterday: daysAgo === 1 ? true : false ,

    daysAgo: daysAgo,

  };

  return theTime;

}



export function getLocalMonths(local,format){

    let months = [];

    let getMonth = (idx) => {
        var objDate = new Date();
        objDate.setDate(1);
        objDate.setMonth(idx-1);
        var locale = local,
            month = objDate.toLocaleString(locale, { month: format });
          return month;
      };
    
      var i;
      for (i = 1; i < 12; i++) {
        months.push(getMonth(i));
      }

      return months;
}


export function getDayTimeToMinutes (startTime){

  let thisYear = new Date().getUTCFullYear();
  let startYear = new Date(startTime).getUTCFullYear();
  let replaceYear = (thisYear === startYear) ? "/" + thisYear : "";
  let dateString : string = (new Date(startTime)).toLocaleDateString('short').replace(replaceYear,'');
  let timeString : string = (new Date(startTime)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  return [dateString,timeString].join(' ');

}

export function getTimeSpan(startTime: string,endTime: string){
  
  //console.log('getBestTimeDelta', startTime, endTime);

  let theStartTime = getDayTimeToMinutes(startTime);
  let forString = '- for';
  let deltaString : string = getBestTimeDelta(startTime,endTime);

  return [theStartTime,forString,deltaString].join(' ');

}

export function getBestTimeDelta(startTime: string,endTime: string){
  let start = new Date(startTime).getTime();
  let end = new Date(endTime).getTime();
  let delta : number = end - start;

  //console.log('getBestTimeDelta', startTime, endTime);

  if (delta/(1000) < 60 ) {
    return delta/(1000) + ' seconds';

  } else if (delta/(msPerMin) < 60 ) {
    return ((delta/msPerMin)).toFixed(0) + ' minutes';

  } else if (delta/(msPerHr) < 24 ) {
    return (delta/(msPerHr)).toFixed(0) + ' hours';

  } else if (delta/(msPerDay) < 7 ) {
    return (delta/(msPerDay)).toFixed(0) + ' days';

  } else if (delta/(msPerDay) < 30 ) {
    return (delta/(msPerWk)).toFixed(0) + ' weeks';

  } else if (delta/(msPerMo) < 24 ) {
    return (delta/(msPerMo)).toFixed(0) + ' months';

  } else if (delta/(msPerYr) < 4 ) {
    return (delta/(msPerYr)).toFixed(0) + ' years';

  } else {
    return 'Infinity and Beyond!';
  }
}


export function getTimeDelta(time1, time2, inWhat : string){
  let date = new Date(time1).getTime();
  let now = new Date(time2).getTime();
  let age : number = (now - date);
  if (inWhat === 'days') { age =  age/(1000 * 60 * 60 * 24) ; }
  else if (inWhat === 'hours') { age =  age/(1000 * 60 * 60) ; }
  else if (inWhat === 'minutes') { age =  age/(1000 * 60) ; }
  else if (inWhat === 'seconds') { age =  age/(1000) ; }
  else if (inWhat === 'best'){
  }

  return age;

}

export function getAge(time, inWhat : string){
  let now = new Date().getTime();
  let age = getTimeDelta(time, now, inWhat);

  return age;

}

export function getGreeting(name: IUser){
  let hour = new Date().getHours();
  let message = "";
  if (hour < 1){
    message = "Almost bedtimenick!";
  } else if (hour < 2){
    message = "Past your bedtimenick?";  
  } else if (hour < 7){
    message = "Top O the mornin to younick";    
  } else if (hour < 12){
    message = "Good morning nick!";
  } else if (hour < 17){
    message = "Afternoon partnernick";   
  } else if (hour < 18){
    message = "It's Five o'clock Somewhere...nick";    
  } else if (hour < 19){
    message = "I'm getting hungry... dinner time yetnick?";    
  } else if (hour < 22){
    message = "Some people start to get sleepy nownick";    
  } else {
    message = "https://en.wikipedia.org/wiki/Midnightnick";    
  }

  //console.log('getGreeting:', name);
  let userName = name;
  if (userName ){
    if (userName.title.indexOf("Click") > -1 ) {
      message = message.replace('Afternoon partner',"Servus");
      message = message.replace('Top O the mornin to you',"Neata");
      message = message.replace('nick'," BK");

    } else if (userName.title.indexOf("Zimmerman") > 0 ) {
      message = message.replace('nick'," BM");
    } else { 
      message = message.replace('nick', " " + userName.initials);
    }
  }
  return message;

}

export function getNicks(name: IUser){
  let hour = new Date().getHours();
  //console.log('getNicks:', name);
  let message = name;
  let result = "";
  if ( message) {
    if (message.title == 'Clickity McClickster'){
      result = "Hey Sunshine!";
    } else if (message.title == 'Mike Zimmerman'){
      result = "Hey Zimmerman!";
    } else {
      result = 'Hi ' + message.title.split(' ')[0];
    }
  }

  return result;

}