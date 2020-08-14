

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
  'es': ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],

  'de': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'fr': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'ja': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'ch': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'ko': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'thai': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'swe': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  'ro-ro': ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"],
};

export const holidays = [
  [12,25],[1,1],[7,4]
];

export const monthStr3 = {
  'en-us':["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'es': ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

  'de-de': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'fr-fr': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

  'ja': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'ch': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'ko': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'thai': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'swe': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'ro-ro': ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

export const weekday3 = {
  'en-us': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'es': ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"], //Should start on Monday

  'de-de': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], //Should start on Monday
  'fr-fr': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], //Should start on Monday

  'ja': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'ch': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'ko': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'thai': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'swe': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], //Should start on Monday
  'ro-ro': ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sam"], //Should start on Monday
};

export interface ITheTime {

  now: Date;
  theTime : string;
  milliseconds : number;
  year?: number;
  month?: number; //Zero Index
  minute?: number; //Zero Index
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

  priorSunday?: Date;
  priorMonday?: Date;
  firstOfMonth?: Date;

  daysSinceSun?: number;
  daysSinceMon?: number;
  daysSinceNewYear?: number;
  daysSinceMonthStart?: number;

  dayMMMDD?: string;
  dayDDDMMMDD?: string;
  dayYYYYMMDD?: string;

  coreTime?: string;
  hoursEarly?: number;
  hoursLate?: number;

}

//https://stackoverflow.com/questions/4156434/javascript-get-the-first-day-of-the-week-from-current-date
function getDayOfWeek(d,sunOrMon: string) {

  let d1 = new Date(d);
  let diff;
  let day = d1.getDay();
  if (sunOrMon === 'sun') {
    diff = d1.getDate() - day;
  } else {
    diff = d1.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  }

  let newDate = new Date(d1.setDate(diff));

  let returnDate = new Date(newDate.getFullYear(),newDate.getMonth(),newDate.getDate());
//  console.log('getDayOfWeek:', d, sunOrMon,newDate );
//  var day = d.getDay(),
//      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday


  return returnDate;
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
export function makeTheTimeObject(timeString, coreStart = 8, coreEnd = 18, useHolidays = holidays) {

  //console.log('makeTimeObject: ', timeString);
  let rightNow = new Date();

  let todayYear = rightNow.getFullYear();
  let todayMonth = rightNow.getMonth() ; //Zero Index
  let todayWeek = ISO8601_week_no(rightNow);
  let todayDate = rightNow.getDate();
  let todayDay = rightNow.getDay();
  let todaysDate = new Date(todayYear,todayMonth,todayDate);

  let todayTime = rightNow.getTime() ;
  let todayHour = rightNow.getHours() ;


  let giveTime = new Date();

  if (timeString != null && timeString.length > 0 ) { 
    giveTime = new Date(timeString);
  } else {
    timeString = giveTime.toLocaleString();
  }

  let givenYear = giveTime.getFullYear();
  let givenMonth = giveTime.getMonth() ; //Zero Index
  let givenWeek = ISO8601_week_no(giveTime);
  let givenDate = giveTime.getDate();
  let givenDay = giveTime.getDay();
  let priorNewYears = new Date(givenYear,0,1);

  let givenTime = giveTime.getTime() ;
  let givenHour = giveTime.getHours() ;
  let givenMinutes = giveTime.getMinutes() ;

  let isThisYear = todayYear === givenYear ? true : false;
  let isThisMonth = isThisYear && todayMonth === givenMonth ? true : false;
  let isThisWeek = isThisYear && givenWeek === todayWeek ? true : false;
  let isToday = isThisMonth && todayDate === givenDate ? true : false;

  let givenDateMidnight = new Date(givenYear,givenMonth,givenDate);
  let firstOfMonth = new Date(givenYear,givenMonth,1);

  let priorSunday = getDayOfWeek(timeString, 'sun');
  let priorMonday = getDayOfWeek(timeString, 'mon');

  let coreTime = 'Normal';
  let hoursEarly = 0;
  let hoursLate = 0;

  let isHoliday = false;

  for ( let d of useHolidays ) {
    if (d[0] - 1 === givenMonth && d[1] == givenDate ) {
      isHoliday = true;
    }
  }

  if ( isHoliday ) {
    coreTime = 'Holiday';

  } else if ( givenDay === 0 || givenDay === 6 ) {
    coreTime = 'Weekend';

  } else if ( givenHour < coreStart ) {
    hoursEarly = coreStart - givenHour;
    hoursEarly += ( 1 - givenMinutes/60 );
    coreTime = 'Early';

  } else if ( givenHour >= coreEnd ) {
    hoursLate = givenHour - coreEnd;
    hoursLate += givenMinutes/60;
    coreTime = 'Late';

  }


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
    minute: givenMinutes,

    isThisYear: isThisYear,
    isThisMonth: isThisMonth,
    isThisWeek: isThisWeek,
    isToday: isToday,
    isYesterday: daysAgo === 1 ? true : false ,

    daysAgo: getTimeDelta(givenDateMidnight, todaysDate, 'days'),
    firstOfMonth: firstOfMonth,
    
    priorSunday: priorSunday,
    priorMonday: priorMonday,

    daysSinceSun: getTimeDelta(priorSunday, todaysDate, 'days'),
    daysSinceMon: getTimeDelta(priorMonday, todaysDate, 'days'),
    daysSinceNewYear: getTimeDelta(priorNewYears, todaysDate, 'days'),
    daysSinceMonthStart: getTimeDelta(firstOfMonth, todaysDate, 'days'),

    dayMMMDD: monthStr3['en-us'][givenMonth] + '-' + givenDate,
    dayDDDMMMDD: [weekday3['en-us'][givenDay],monthStr3['en-us'][givenMonth],givenDate].join(' '),
    dayYYYYMMDD: [givenYear,("0" + (givenMonth + 1)).slice(-2),givenDate].join('-'),

    coreTime: coreTime,
    hoursEarly: hoursEarly,
    hoursLate: hoursLate,

  };

  //console.log('theTime:', theTime);
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
  if (inWhat === 'days') { 
    age =  age/(1000 * 60 * 60 * 24) ;
    age = Math.round(age);  //2020-03-02:  Added so that delta days is always whole number when in reality, 8 months out of the year there is an extra hour per day
  }
  else if (inWhat === 'hours') { age =  age/(1000 * 60 * 60) ; }
  else if (inWhat === 'minutes') { age =  age/(1000 * 60) ; }
  else if (inWhat === 'seconds') { age =  age/(1000) ; }
  else if (inWhat === 'ms') { age =  age ; }
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
    if (userName.title.indexOf("Click") === 0 ) {
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
    if (message.title.indexOf('Click') === 0 ){
      result = "Hey Sunshine!";
    } else if (message.title == 'Mike Zimmerman'){
      result = "Hey Zimmerman!";
    } else {
      result = 'Hi ' + message.title.split(' ')[0];
    }
  }

  return result;

}


export function createDeltaDateArrays(){


        let result = {
        years: {
          daysAgo: [],
          daysAgoR: [],
          daysAgoNull: [],
          labelShort: [],
          labelLong: [],
        },
        months: {        
          daysAgo: [],
          daysAgoR: [],
          daysAgoNull: [],
          labelShort: [],
          labelLong: [],
      }
    };
        
    let rightNow = new Date();

    let todayYear = rightNow.getFullYear();
    let todayMonth = rightNow.getMonth() ; //Zero Index
    let todayDate = rightNow.getDate();

    let todaysDate = new Date(todayYear,todayMonth,todayDate);

    for (let y = todayYear; y > todayYear  - 4 ; y--) {
      for (let m = 11; m > -1 ; m--) {

        let thisDate = new Date(y,m,1);
        let deltaDays = getTimeDelta(thisDate, todaysDate, 'days');

        if ( deltaDays > 0 ) {
          result.months.daysAgo.push(deltaDays);
          let roundedDays = Math.round(deltaDays);
          result.months.daysAgoR.push(roundedDays);
          result.months.labelShort.push(y.toString().substring(2) + '-' + monthStr3['en-us'][m]);
          result.months.labelLong.push(y.toString() + '-' + monthStr3['en-us'][m]);

          result.months.daysAgoNull[roundedDays] = null;

          if ( m === 0 ) { 
            result.years.daysAgo.push(deltaDays);
            result.years.daysAgoR.push(roundedDays);
            result.years.labelShort.push(y.toString().substring(2));
            result.years.labelLong.push(y.toString());
            result.years.daysAgoNull[roundedDays] = null;
          }
        }
      }
    }

    return result;

}