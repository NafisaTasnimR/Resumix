/**
 * Minimal Express-free route runner. No supertest, no HTTP request, no
 * server listening on a port -- we call the real middleware/controller
 * functions directly with a hand-built req/res and chain them the same
 * way Express would when a request matches a route.
 */

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    sent: false,
  };
  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn((body) => {
    res.body = body;
    res.sent = true;
    return res;
  });
  res.send = jest.fn((body) => {
    res.body = body;
    res.sent = true;
    return res;
  });
  res.setHeader = jest.fn((name, value) => {
    res.headers[name] = value;
    return res;
  });
  res.set = res.setHeader;
  return res;
}

/**
 * Runs a chain of Express-style handlers -- middleware `(req, res, next)`
 * and a terminal controller `(req, res)` -- against one shared req/res,
 * the same way Express would when a request matches a route with several
 * middleware in front of a controller. Stops as soon as a handler doesn't
 * call `next()` (i.e. it already sent a response).
 */
async function runHandlers(handlers, req) {
  const res = createMockRes();
  for (const handler of handlers) {
    const isMiddleware = handler.length >= 3; // (req, res, next)
    if (!isMiddleware) {
      await handler(req, res);
      break;
    }
    // Every middleware in this codebase calls next() synchronously (or
    // synchronously sends a response instead) -- none of them defer next()
    // behind an unresolved async gap -- so `await` on the call itself
    // (sync or async) is enough to know whether next() ran by the time it
    // settles. Stop the chain the moment a middleware sends a response
    // instead of calling next(), same as Express would.
    let calledNext = false;
    const next = () => {
      calledNext = true;
    };
    await handler(req, res, next);
    if (!calledNext) break;
  }
  return res;
}

function makeReq({ body = {}, headers = {}, params = {}, user } = {}) {
  return { body, headers, params, user };
}

/**
 * Pulls the middleware chain for one route straight off an Express Router
 * instance (e.g. `require('../routes/PaymentRouter')`), so routes whose
 * handlers are declared inline (not separately exported, like PaymentRouter's)
 * can still be tested without spinning up the app or an HTTP server.
 */
function getRouteHandlers(router, method, path) {
  const layer = router.stack.find(
    (l) => l.route && l.route.path === path && l.route.methods[method.toLowerCase()]
  );
  if (!layer) {
    throw new Error(`No ${method} route registered for "${path}"`);
  }
  return layer.route.stack.map((l) => l.handle);
}

module.exports = { createMockRes, runHandlers, makeReq, getRouteHandlers };
