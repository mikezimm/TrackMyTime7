

import * as React from 'react';

import {IProject, ISmartText, ITimeEntry, IProjectTarget, IProjects, IProjectInfo, IEntryInfo, IEntries, ITrackMyTime7State, ISaveEntry} from '../ITrackMyTime7State';

import { IUser, ILink, IChartSeries, ICharNote,  } from '../../../../services/IReUsableInterfaces';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import * as strings from 'TrackMyTime7WebPartStrings';

import ButtonCompound from '../createButtons/ICreateButtons';
import { IButtonProps,ISingleButtonProps,IButtonState } from "../createButtons/ICreateButtons";
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';

import { TextField, MaskedTextField } from "office-ui-fabric-react";
import styles from '../TrackMyTime7.module.scss';

import { IFieldDef } from './fieldDefinitions';

import {
    Button,
    ButtonType
  } from 'office-ui-fabric-react';

  
 
  export function createPrefixTextField(field: IFieldDef, currentValue, updateField, prefix, blinkOnProjectClassName){
    // it is possible to have an option to hide labels in lue of placeholder text for more compressed look
 
    let placeHolder = 'Enter ' + field.title;
 
    placeHolder = '';
 
     let textField =  field.hidden ? '' : 
     <TextField
       //className={ [styles.textField, styles.highlightBlink].join(' ') }
       className={ blinkOnProjectClassName }
       defaultValue={ currentValue ? currentValue : "" }
       prefix= { prefix }
       label={ field.title }
       disabled={ field.disabled }
       placeholder={ placeHolder }
       autoComplete='off'
       onChanged={ updateField }
       required={ field.required }
     />;
     
     return textField;
   }


 export function createBasicTextField(field: IFieldDef, currentValue, updateField, blinkOnProjectClassName){
   // it is possible to have an option to hide labels in lue of placeholder text for more compressed look

   let placeHolder = 'Enter ' + field.title;
    let defaultValue = "";
    if (currentValue && currentValue !== "*") { defaultValue = currentValue; }
   placeHolder = '';

    let textField = field.hidden ? '' : 
    <TextField
      //className={ [styles.textField, styles.highlightBlink].join(' ') }
      className={ blinkOnProjectClassName }
      defaultValue={ defaultValue }
      label={ field.title }
      disabled={ field.disabled }
      placeholder={ placeHolder }
      autoComplete='off'
      onChanged={ updateField }
      required={ field.required }
    />;
    
    return textField;
  }

  

 export function createSmartLinkField(field: IFieldDef, currentValue, updateField, blinkOnProjectClassName){
  // it is possible to have an option to hide labels in lue of placeholder text for more compressed look

  let placeHolder = 'Enter ' + field.title;
   let defaultValue = "";
   if (currentValue && currentValue !== "*") { defaultValue = currentValue; }
  placeHolder = '';

   let textField =  field.hidden ? '' : 
   <TextField
     //className={ [styles.textField, styles.highlightBlink].join(' ') }
     className={ blinkOnProjectClassName }
     defaultValue={ defaultValue }
     label={ field.title }
     disabled={ field.disabled }
     placeholder={ placeHolder }
     autoComplete='off'
     onChanged={ updateField }
     required={ field.required }
   />;
   
   return textField;
 }

  /**
   * An object defining the format characters and corresponding regexp values.
   * Default format characters: \{
   *  '9': /[0-9]/,
   *  'a': /[a-zA-Z]/,
   *  '*': /[a-zA-Z0-9]/
   * \}
   */

  export function createMaskedTextField(field: IFieldDef, mask, currentValue, onChanged, blinkOnProjectClassName){

    let label = field.title + " (" + mask.replace('\\','') + ")";
    let textField =  field.hidden ? '' : 

    <MaskedTextField 
      className={ blinkOnProjectClassName }
      defaultValue={ currentValue }
      label={ label }
      disabled={ field.disabled }
      mask={ mask }
      maskChar="?"
      autoComplete='off'
      onChanged={ onChanged }
      required={ field.required }
     />;
    
    return textField;
  }

  /**
   * This was added to get className for any type of field
   * @param field 
   * @param blinkOnProject 
   */
  export function getBlinkOnProjectClass(field: IFieldDef, blinkOnProject) {

    let classes = [styles.textField];
    if (blinkOnProject === 1 && field.blinkOnProject === true ) {
     classes = [styles.textField1];
    } else if (blinkOnProject === 2 && field.blinkOnProject === true ) {
     classes = [styles.textField2];
    }
    let classNames = classes.join(' ');

    return classNames;

  }

  export function createSmartTextBox(parentProps: ITrackMyTime7Props, parentState : ITrackMyTime7State, field: IFieldDef, onChanged){

    //Return nothing if user has not been loaded because that is when formEntry gets created.
    if ( parentState.userLoadStatus !== "Complete" ) { return ""; }
    let thisField = parentState.formEntry[field.name]['title'];
    let currentValue = parentState.formEntry[field.name]['value'];
    // 2019-12-22:  Removed this line when I created fieldDefs... but don't yet have state for that in the new object
    field.required = parentState.formEntry[field.name]['required'];

    let mask = parentState.formEntry[field.name]['mask'];
    let blinkOnProjectClassName = getBlinkOnProjectClass(field, parentState.blinkOnProject);

    if (parentState.formEntry[field.name]['defaultIsPrefix'] === true ){
      if (parentState.formEntry[field.name]['defaultIsPrefix'] === parentState.formEntry[field.name]['value'] ) { parentState.formEntry[field.name]['value'] = ''; }
      return createPrefixTextField(field, currentValue, onChanged, parentState.formEntry[field.name]['prefix'], blinkOnProjectClassName);
    } else if (mask !== '') {
      return createMaskedTextField(field, mask, currentValue, onChanged, blinkOnProjectClassName);
    } else {
      return createBasicTextField(field, currentValue, onChanged, blinkOnProjectClassName);
    }
    
  }

  export function createThisField(parentProps: ITrackMyTime7Props, parentState : ITrackMyTime7State, field: IFieldDef, isSaveDisabled:boolean = false ,onChanged){

    //Return nothing if user has not been loaded because that is when formEntry gets created.
    if ( parentState.userLoadStatus !== "Complete" ) { return ""; }

    //console.log('createThisField field:', field);
    //console.log('Hey there!');
    field.disabled = isSaveDisabled;
    field.hidden = parentState.formEntry[field.name]['hidden'];

    if (field.type === "Smart") {
      //2020-02-06:  Adding this check prevents total crash when changing pivots while no item is selected.
      if ( parentState.formEntry[field.name] == null ) {
        let blinkOnProjectClassName = getBlinkOnProjectClass(field, parentState.blinkOnProject);
        return createBasicTextField(field, null, onChanged, blinkOnProjectClassName);
      } else {
        return createSmartTextBox(parentProps, parentState, field, onChanged );
      }


    } else if ( field.type === "Text" ) {
      // 2019-12-22:  Removed this line when I created fieldDefs... but don't yet have state for that in the new object
      //let required = currentValue === "*" ? true : false;
      let currentValue = parentState.formEntry[field.name];
      let blinkOnProjectClassName = getBlinkOnProjectClass(field, parentState.blinkOnProject);

      return createBasicTextField(field, currentValue, onChanged, blinkOnProjectClassName);

    }  else if (field.type === "SmartLink") {
      let currentValue = parentState.formEntry[field.name]['url'];
      let blinkOnProjectClassName = getBlinkOnProjectClass(field, parentState.blinkOnProject);

      return createSmartLinkField(field, currentValue, onChanged, blinkOnProjectClassName);

    }

    return ;

  }