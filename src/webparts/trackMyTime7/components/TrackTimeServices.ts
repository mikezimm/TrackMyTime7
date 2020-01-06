
import {sp} from "@pnp/sp";
import { find, indexOf, includes } from "lodash";
import { ITrackMyTime7Props } from './ITrackMyTime7Props';
import { AadHttpClient, HttpClientResponse, IAadHttpClientOptions } from "@microsoft/sp-http";


export class TrackMyProjectsLoad {
    
    /*
    public siteUsers: SPSiteUser[];
    public siteGroups: SPSiteGroup[];
    public roleDefinitions: SPRoleDefinition[];
    public lists: (SPList | SPListItem)[];
    public constructor() {
  
      this.siteUsers = new Array<SPSiteUser>();
      this.siteGroups = new Array<SPSiteGroup>();
      this.roleDefinitions = new Array<SPRoleDefinition>();
      this.siteUsers = new Array<SPSiteUser>();
      this.lists = new Array<SPList>();
  
    }
    */

  }


export class Helpers {

    /*

  public loadData(): Promise<TrackMyProjectsLoad> {
        let trackMyProjects: TrackMyProjectsLoad = new TrackMyProjectsLoad();
        let batch: any = sp.createBatch();


        sp.web.siteUsers
        .inBatch(batch).get().then((response) => {
            console.table(response);
            trackMyProjects.siteUsers = response.map((u) => {
                let user: SPSiteUser = new SPSiteUser();
                return user;
            });
            return trackMyProjects.siteUsers;
        });

        sp.web.siteGroups.expand("Users").select("Title", "Id", "IsHiddenInUI", "IsShareByEmailGuestUse", "IsSiteAdmin", "IsSiteAdmin")
            .inBatch(batch).get().then((response) => {
            let AdGroupPromises: Array<Promise<any>> = [];
            // if group contains an ad group(PrincipalType=4) expand it
            trackMyProjects.siteGroups = response.map((grp) => {
                let siteGroup: SPSiteGroup = new SPSiteGroup();
                return siteGroup;
            });
            return Promise.all(AdGroupPromises).then(() => {
                return trackMyProjects.siteGroups;
            });

        });

        return batch.execute().then(() => {
            return trackMyProjects;
        });




    }    //LoadData 
            */
}