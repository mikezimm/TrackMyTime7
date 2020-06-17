




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

export interface IMyListInfo {
    webURL?: string,
    title: string,
    desc?: string,
    template?: number,
    enableContentTypes?: boolean,
    additionalSettings?: Partial<IListInfo>,
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