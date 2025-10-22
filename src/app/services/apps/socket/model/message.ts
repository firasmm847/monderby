import { Action } from "./action";
import { Event } from "./event";

export interface Message {
    id: string;
    action: string;
    type: string;
    author?: string;
    author_name?: string;
    recipient: string;
    text: string;
    copy: any,
    private: boolean,
    res: any,
    project_lib?: string,
    smartNumber?: string,
    date: string;
    ongletid? : string;
}