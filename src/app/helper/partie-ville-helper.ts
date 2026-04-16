import { PartieModel } from "../models/partie-model";
import { VilleSeconHelper } from "./ville-secon-helper";

export interface PartieVilleHelper {
    partie: PartieModel;
    villes: VilleSeconHelper[];
}
