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


async function runHandlers(handlers, req) {
  const res = createMockRes();
  for (const handler of handlers) {
    const isMiddleware = handler.length >= 3; // (req, res, next)
    if (!isMiddleware) {
      await handler(req, res);
      break;
    }
    
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
