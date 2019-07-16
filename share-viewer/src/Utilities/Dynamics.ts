import { CrmBaseEntity } from "../Typings/WebApi";

export default class Dynamics {
    public static getCurrentRecordEntityName(): string {
        return window.Xrm.Page.data.entity.getEntityName();
    }
    public static getCurrentRecordId(): string {
        return window.Xrm.Page.data.entity.getId();
    }
}
