import { nanoid } from "nanoid";
import debug from "debug";

/**
 * Return middleware that gets an unique request id from a header or
 * generates a new id.
 *
 * @param {Object} [options={}] - Optional configuration.
 * @param {string} [options.query] - Request query name to get the forwarded request id.
 * @param {string} [options.header=X-Request-Id] - Request header name to get the forwarded request id.
 * @param {string} [options.exposeHeader=X-Request-Id] - Response header name.
 * @param {function} [options.generator=uuidV4] - Id generator function.
 * @return {function} Koa middleware.
 */
const middleware = (options = {}) => {
  const {
    query = null,
    header = "X-Request-Id",
    exposeHeader = "X-Request-Id",
    generator = nanoid,
  } = options;

  debug("koa:request-id")("Create the middleware.");

  return async function requestId(ctx, next) {
    const reqId =
      query & ctx.query[query] || (header && ctx.get(header)) || generator();

    debug("koa:request-id")(`reqId=${reqId}`);

    (ctx.id = reqId), (ctx.state.reqId = reqId);

    if (exposeHeader) {
      ctx.set(exposeHeader, reqId);
    }

    await next();
  };
};

module.exports = middleware;
