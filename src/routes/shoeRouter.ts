import { NextFunction, Request, Response, Router} from "express";
import { ShoeModel } from "../models/shoe_model";
import { BaseRoute } from "./router";
import helpers = require("../helperFunctions");

let userJson: any;
let userKeys: any;
let userShoes: any[] = [];

export class ShoeRouter extends BaseRoute {

    public static create(router: Router) {
        router.get("/user/:id/add_shoe/:id2", (req: Request, res: Response, next: NextFunction) => {
            new ShoeRouter().inputShoe(req, res, next);
        });

    }

    public async inputShoe(req: Request, res: Response, next: NextFunction) {
        const userIdString = "id";
        const userId = parseInt(req.params[userIdString], 10);
        const shoeIdString = "id2";
        const shoeId = parseInt(req.params[shoeIdString], 10);
        const shoe = await this.getShoe(shoeId);
        if (shoe) {
            this.render(req, res, "addShoe", {id: userId, shoe});
        } else {
            res.status(404)
                .send({
                    message: "No shoe found with the given id.",
                    status: res.status,
                });
        }

    }

    private has_shoe(userShoes: any, shoeID: number) {
        for (const item in userShoes) {
            if (userShoes.hasOwnProperty(item)) {
                const shoeid: number = userShoes[item].shoe_id;
                if (shoeid === shoeID) {
                   return true;
                }
            }
        }
        return false;
    }

    private getPurchasePrice(id: number) {
        let purchase = 0;
        for (const item in userShoes) {
            if (userShoes.hasOwnProperty(item)) {
                const shoeid: number = userKeys[item].shoe_id;
                if (shoeid === id) {
                    purchase = userKeys[item].purchase_price;
                }
            }
        }
        return purchase;
    }

    private async getUserShoes(userKeys: any) {
        const shoeIf = new ShoeModel();
        const uShoes = await shoeIf.getAllShoes(userKeys);
        return uShoes;
    }

    private async getShoe(shoeId: number) {
        const shoeIf = new ShoeModel();
        const shoe = await shoeIf.getOneShoe(shoeId);
        if (shoe) {
            return shoe;
        } else {
            return;
        }
    }

}
