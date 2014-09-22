"use strict";
Object.defineProperties(exports, {
  bufferConvertHandler: {get: function() {
      return bufferConvertHandler;
    }},
  bufferConvertFilter: {get: function() {
      return bufferConvertFilter;
    }},
  chunkedTransformHandler: {get: function() {
      return chunkedTransformHandler;
    }},
  unchunkedTransformHandler: {get: function() {
      return unchunkedTransformHandler;
    }},
  headerExtractFilter: {get: function() {
      return headerExtractFilter;
    }},
  throttledStreamFilter: {get: function() {
      return throttledStreamFilter;
    }},
  timeoutStreamFilter: {get: function() {
      return timeoutStreamFilter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_component__,
    $__quiver_45_stream_45_util__,
    $__buffer_46_js__,
    $__stream_46_js__,
    $__chunked_46_js__,
    $__head_46_js__,
    $__throttle_46_js__,
    $__timeout_46_js__;
var $__0 = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}),
    simpleHandler = $__0.simpleHandler,
    streamHandler = $__0.streamHandler,
    streamFilter = $__0.streamFilter;
var streamToStreamable = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}).streamToStreamable;
var $__2 = ($__buffer_46_js__ = require("./buffer.js"), $__buffer_46_js__ && $__buffer_46_js__.__esModule && $__buffer_46_js__ || {default: $__buffer_46_js__}),
    convertStream = $__2.convertStream,
    bufferizeStreamable = $__2.bufferizeStreamable;
var streamConvertFilter = ($__stream_46_js__ = require("./stream.js"), $__stream_46_js__ && $__stream_46_js__.__esModule && $__stream_46_js__ || {default: $__stream_46_js__}).streamConvertFilter;
var $__4 = ($__chunked_46_js__ = require("./chunked.js"), $__chunked_46_js__ && $__chunked_46_js__.__esModule && $__chunked_46_js__ || {default: $__chunked_46_js__}),
    streamToChunkedStream = $__4.streamToChunkedStream,
    streamToUnchunkedStream = $__4.streamToUnchunkedStream;
var extractStreamHead = ($__head_46_js__ = require("./head.js"), $__head_46_js__ && $__head_46_js__.__esModule && $__head_46_js__ || {default: $__head_46_js__}).extractStreamHead;
var throttledStream = ($__throttle_46_js__ = require("./throttle.js"), $__throttle_46_js__ && $__throttle_46_js__.__esModule && $__throttle_46_js__ || {default: $__throttle_46_js__}).throttledStream;
var timeoutStream = ($__timeout_46_js__ = require("./timeout.js"), $__timeout_46_js__ && $__timeout_46_js__.__esModule && $__timeout_46_js__ || {default: $__timeout_46_js__}).timeoutStream;
var bufferConvertHandler = (function(converter) {
  return simpleHandler((function(args, inputStream) {
    return convertStream(converter, inputStream);
  }), 'stream', 'stream');
});
var bufferConvertFilter = (function(bufferConverter, mode) {
  var inReplace = arguments[2] !== (void 0) ? arguments[2] : false;
  var converterBuilder = (function(config) {
    return (function(readStream) {
      return convertStream(bufferConverter, readStream);
    });
  });
  return streamConvertFilter(converterBuilder, mode, inReplace);
});
var chunkedTransformHandler = simpleHandler((function(args, inputStream) {
  return streamToChunkedStream(inputStream);
}), 'stream', 'stream').privatizedConstructor();
var unchunkedTransformHandler = simpleHandler((function(args, inputStream) {
  return streamToUnchunkedStream(inputStream);
}), 'stream', 'stream').privatizedConstructor();
var headerExtractFilter = (function(separator) {
  if (!Buffer.isBuffer(separator))
    separator = new Buffer(separator);
  return streamFilter((function(config, handler) {
    var $__9;
    var $__8 = config,
        streamHeadMaxLength = ($__9 = $__8.streamHeadMaxLength) === void 0 ? -1 : $__9;
    var extractOptions = {maxLength: streamHeadMaxLength};
    return (function(args, inputStreamable) {
      return inputStreamable.toStream.then((function(readStream) {
        return extractStreamHead(readStream, separator, extractOptions);
      })).then((function($__10) {
        var $__11 = $__10,
            header = $__11[0],
            readStream = $__11[1];
        args.header = header;
        var streamable = streamToStreamable(readStream);
        return handler(args, streamable);
      }));
    });
  }));
});
var throttledStreamFilter = (function() {
  var mode = arguments[0] !== (void 0) ? arguments[0] : 'inout';
  var converterBuilder = (function(config) {
    var $__9;
    var $__8 = config,
        streamThrottleRate = ($__9 = $__8.streamThrottleRate) === void 0 ? -1 : $__9;
    if (!(streamThrottleRate > 0))
      return null;
    return (function(readStream) {
      return throttledStream(readStream, streamThrottleRate);
    });
  });
  return streamConvertFilter(converterBuilder, mode, true);
});
var timeoutStreamFilter = (function() {
  var mode = arguments[0] !== (void 0) ? arguments[0] : 'inout';
  var converterBuilder = (function(config) {
    var $__9;
    var $__8 = config,
        streamTimeout = ($__9 = $__8.streamTimeout) === void 0 ? -1 : $__9;
    if (!(streamTimeout > 0))
      return null;
    return (function(readStream) {
      return timeoutStream(readStream, streamTimeout);
    });
  });
  return streamConvertFilter(converterBuilder, mode, true);
});
