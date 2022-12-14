import { UrlsModel } from "../model/urls.js";
import { randomHash } from "../modules/shorturl.js";
import { memoryCache } from "../modules/cache.js";
export class ApiController {
    static hashMinLength = 4;

    static async generateHash(req, res, next) {
        let length = ApiController.hashMinLength;
        let retry = 0;
        let hash = randomHash(length);
        while (true) {
            const result = await UrlsModel.findOne({ where: { hash: hash } });
            if (!result) {
                await UrlsModel.create({
                    hash: hash,
                    url: encodeURI(req.body.url),
                }).catch(() => {
                    return res.status(503).json({ error: 'Service Unavailable' })
                });
                break;
            } else {
                if (retry >= 3) {
                    length++;
                    retry = 0;
                }
                hash = randomHash(length);
                retry++;
            }
        }
        return res.json({
            hash: hash,
        });
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