import { UrlsModel } from "../model/urls.js";
import { randomHash } from "../modules/shorturl.js";
import { memoryCache } from "../modules/cache.js";
export class ApiController {
    static hashMinLength = 4;

    static async generateHash(req, res, next) {
        let length = ApiController.hashMinLength;
        let retry = 0;
        let hash = randomHash(length);
        let response = { status: 200, message: null };
        while (true) {
            try {
                await UrlsModel.create({
                    hash: hash,
                    url: encodeURI(req.body.url),
                }).then(() => {
                    response.message = { hash: hash };
                })
                break;
            } catch (error) {
                if (error?.original?.errno == 1062) {
                    if (retry >= 3) {
                        length++;
                        retry = 0;
                    }
                    hash = randomHash(length);
                    retry++;
                } else {
                    response.status = 503;
                    response.message = { error: 'Service Unavailable', message: error.message, code: error?.original?.errno || error.code };
                    break;
                }
            }
        }
        return res.status(response.status).json(response.message);
    }

    static async findURL(req, res, next) {
        let result = await memoryCache.get(req.params.hash);
        if (!result) {
            result = await UrlsModel.findOne({ where: { hash: req.params.hash }, raw: true });
            if (!result) {
                return res.status(404).send("Not found: " + req.params.hash);
            }
            await UrlsModel.update(
                {
                    lastResolve: new Date().toISOString()
                },
                {
                    where: { hash: req.params.hash }
                }
            );
            await memoryCache.set(req.params.hash, result);
        }
        if (/^(http|https):\/\//.test(result.url)) {
            return res.redirect(result.url);
        } else {
            return res.redirect(`//${result.url}`);
        }
    }
}