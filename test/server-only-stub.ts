// Next resolves "server-only" through its own bundled copy, which maps the
// react-server condition to an empty module and every other condition to a
// module that throws. Vitest does not set that condition, so importing a
// server module under test would throw instead of loading. This stub keeps the
// production boundary intact while letting tests import server-only modules.
export {};
