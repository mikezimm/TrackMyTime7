




/**
 * Ensures that the specified list exists in the collection (note: this method not supported for batching)
 *
 * @param title The new list's title
 * @param desc The new list's description
 * @param template The list template value
 * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
 * @param additionalSettings Will be passed as part of the list creation body or used to update an existing list
 */
// ensure(title: string, desc?: string, template?: number, enableContentTypes?: boolean, additionalSettings?: Partial<IListInfo>): Promise<IListEnsureResult>;

export function notify(statusLog, step , f, verb, status, returnField, noAlert = false) {
    if ( f == null ) { f = {name:''} ; }

    let thisNotify = {
        time: (new Date()).toLocaleString() ,  
        step: step, item: f.name ? f.name : f.Title,  
        verb: verb,   
        status: status,
    };
    //alert(verb + ' ' + f.name + ' ' + status );
    statusLog.push(thisNotify);

    return statusLog;
}

export function getXMLObjectFromString(str, tag, toText, removeTag = false) {
    // 2020-06-24:  Copied from Views_.aspx of Super Contents
    // Gets tag from an XML string like pulling "Fields" out of a view schema
    // toText will then also convertTagsToHTML for display on a page.

      var fullTag = "";
  
      if (str == null) {
        return "null viewQuery";
      }
  
      var tagLength = tag.length;
      var tag1 = "<" + tag;
      var tag2 = "</" + tag + ">";
      var IndexOf1 = str.indexOf(tag1);
      var IndexOf2 = str.indexOf(tag2);
  
      if (IndexOf1 > -1 && IndexOf1 > -1) {
        fullTag = str.substring(IndexOf1, IndexOf2 + tagLength + 3);
  
      }
  
      if (toText === true) { //Then convert <> to html valid
  
        fullTag = fullTag.replace(/[<]/g, "&lt;");
        fullTag = fullTag.replace(/[>]/g, "&gt;");
  
      }

      if (removeTag === true) { //Then convert <> to html valid
        fullTag = fullTag.slice(tagLength + 2, fullTag.length - (tagLength + 3));
      }

  
  
      return fullTag;
}

export interface IServiceLog {
    time: string;
    step: string;
    verb: string;
    status: string;
}

export interface IMyListInfo {
    webURL?: string;
    title: string;
    desc?: string;
    template?: number;
    enableContentTypes?: boolean;
    additionalSettings?: Partial<IListInfo>;
}

export interface IListInfo {
    EnableRequestSignOff: boolean;
    EnableVersioning: boolean;
    EntityTypeName: string;
    ExemptFromBlockDownloadOfNonViewableFiles: boolean;
    FileSavePostProcessingEnabled: boolean;
    ForceCheckout: boolean;
    HasExternalDataSource: boolean;
    Hidden: boolean;
    Id: string;
    ImagePath: {
        DecodedUrl: string;
    };
    ImageUrl: string;
    IrmEnabled: boolean;
    IrmExpire: boolean;
    IrmReject: boolean;
    IsApplicationList: boolean;
    IsCatalog: boolean;
    IsPrivate: boolean;
    ItemCount: number;
    LastItemDeletedDate: string;
    LastItemModifiedDate: string;
    LastItemUserModifiedDate: string;
    ListExperienceOptions: number;
    ListItemEntityTypeFullName: string;
    MajorVersionLimit: number;
    MajorWithMinorVersionsLimit: number;
    MultipleDataList: boolean;
    NoCrawl: boolean;
    ParentWebPath: {
        DecodedUrl: string;
    };
    ParentWebUrl: string;
    ParserDisabled: boolean;
    ServerTemplateCanCreateFolders: boolean;
    TemplateFeatureId: string;
    Title: string;
}