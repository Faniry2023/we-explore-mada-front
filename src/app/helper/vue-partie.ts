import { PartieModel } from "../models/partie-model";
import { VilleModel } from "../models/ville-model";

export interface VuePartie {
    partie: PartieModel;
    villes: VilleModel[];
}
