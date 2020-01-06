

export interface ITheTime {
  now: Date;
  theTime : string;
  milliseconds : number;
}


export function makeTheTimeObject(timeString) {

  let now = new Date();

  if (timeString ) { now = new Date(timeString);}

  let theTime : ITheTime = {
    now: now,
    theTime: now.toUTCString(),
    milliseconds: now.getTime(),
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

export function msPerMin(){
  return 60000;
}
export function msPerHr(){
  return 3600000;
}
export function msPerDay(){
  return 86400000;
}
export function msPerWk(){
  return 604800000;
}
export function msPerMo(){
  return 2678400000;
}
export function msPerQ(){
  return 7776000000;
}
export function msPerYr(){
  return 31536000000;
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

  } else if (delta/(msPerMin()) < 60 ) {
    return ((delta/msPerMin())).toFixed(0) + ' minutes';

  } else if (delta/(msPerHr()) < 24 ) {
    return (delta/(msPerHr())).toFixed(0) + ' hours';

  } else if (delta/(msPerDay()) < 7 ) {
    return (delta/(msPerDay())).toFixed(0) + ' days';

  } else if (delta/(msPerDay()) < 30 ) {
    return (delta/(msPerWk())).toFixed(0) + ' weeks';

  } else if (delta/(msPerMo()) < 24 ) {
    return (delta/(msPerMo())).toFixed(0) + ' months';

  } else if (delta/(msPerYr()) < 4 ) {
    return (delta/(msPerYr())).toFixed(0) + ' years';

  } else {
    return 'Infinity and Beyond!';
  }
}

export function getTimeDelta(time1, time2, inWhat){
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

export function getAge(time, inWhat){
  let now = new Date().getTime();
  let age = getTimeDelta(time, now, inWhat);

  return age;

}

export function getGreeting(name){
  let hour = new Date().getHours();
  let message = "";
  if (hour < 1){
    message = "Almost bedtimenick!";
  } else if (hour < 2){
    message = "Past your bedtimenick?";  
  } else if (hour < 7){
    message = "Top O the mornin to younick";    
  } else if (hour < 12){
    message = "Good morning SharePoint Usernick!";    
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
    }
  }
  return message;

}

export function getNicks(name){
  let hour = new Date().getHours();
  //console.log('getNicks:', name);
  let message = name;
  if ( message) {
    if (message.title == 'Clickity McClickster'){
      message = "Hey Sunshine!";
    } else if (message.title == 'Mike Zimmerman'){
      message = "Hey Zimmerman!";
    } else {
      message = 'Hi ' + message.split(' ')[0];
    }
  }

  return message;

}