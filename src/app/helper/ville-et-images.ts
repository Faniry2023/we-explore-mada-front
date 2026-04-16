import { ImageModel } from "../models/image-model";
import { VilleModel } from "../models/ville-model";

export interface VilleEtImages {
    villes: VilleModel;
    images: string[];
}
