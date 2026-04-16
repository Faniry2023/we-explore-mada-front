import { ImageModel } from "../models/image-model";
import { SiteModel } from "../models/site-model";

export interface SiteEtImage {
    site: SiteModel;
    images: string[];
}
