import { r as require$$1, c as commonjsGlobal, a as commonjsRequire } from "./index-4e3b75b6.js";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
var pem$1 = {};
var promisify$2 = {};
Object.defineProperty(promisify$2, "__esModule", {
  value: true
});
promisify$2.promisify = promisify$1;
var customArgumentsToken = "__ES6-PROMISIFY--CUSTOM-ARGUMENTS__";
function promisify$1(original) {
  if (typeof original !== "function") {
    throw new TypeError("Argument to promisify must be a function");
  }
  var argumentNames = original[customArgumentsToken];
  var ES6Promise = promisify$1.Promise || Promise;
  if (typeof ES6Promise !== "function") {
    throw new Error("No Promise implementation found; do you need a polyfill?");
  }
  return function() {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return new ES6Promise(function(resolve, reject) {
      args.push(function callback(err) {
        if (err) {
          return reject(err);
        }
        for (var _len2 = arguments.length, values = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          values[_key2 - 1] = arguments[_key2];
        }
        if (values.length === 1 || !argumentNames) {
          return resolve(values[0]);
        }
        var o = {};
        values.forEach(function(value, index) {
          var name = argumentNames[index];
          if (name) {
            o[name] = value;
          }
        });
        resolve(o);
      });
      original.apply(_this, args);
    });
  };
}
promisify$1.argumentNames = customArgumentsToken;
promisify$1.Promise = void 0;
var helperExports = {};
var helper$3 = {
  get exports() {
    return helperExports;
  },
  set exports(v) {
    helperExports = v;
  }
};
var isWindows$1 = process.platform === "win32";
var trailingSlashRe = isWindows$1 ? /[^:]\\$/ : /.\/$/;
var osTmpdir$1 = function() {
  var path2;
  if (isWindows$1) {
    path2 = {}.TEMP || {}.TMP || ({}.SystemRoot || {}.windir) + "\\temp";
  } else {
    path2 = {}.TMPDIR || {}.TMP || {}.TEMP || "/tmp";
  }
  if (trailingSlashRe.test(path2)) {
    path2 = path2.slice(0, -1);
  }
  return path2;
};
(function(module) {
  var pathlib2 = require$$1;
  var fs2 = require$$1;
  var crypto2 = require$$1;
  var osTmpdir2 = osTmpdir$1;
  var tempDir2 = {}.PEMJS_TMPDIR || osTmpdir2();
  module.exports.isNumber = function(str) {
    if (Array.isArray(str)) {
      return false;
    }
    return /^\d+$/g.test(str);
  };
  module.exports.isHex = function isHex(hex) {
    return /^(0x){0,1}([0-9A-F]{1,40}|[0-9A-F]{1,40})$/gi.test(hex);
  };
  module.exports.toHex = function toHex(str) {
    var hex = "";
    for (var i = 0; i < str.length; i++) {
      hex += "" + str.charCodeAt(i).toString(16);
    }
    return hex;
  };
  module.exports.ciphers = ["aes128", "aes192", "aes256", "camellia128", "camellia192", "camellia256", "des", "des3", "idea"];
  var ciphers = module.exports.ciphers;
  module.exports.createPasswordFile = function(options, params, PasswordFileArray) {
    if (!options || !Object.prototype.hasOwnProperty.call(options, "password") || !Object.prototype.hasOwnProperty.call(options, "passType") || !/^(word|in|out)$/.test(options.passType)) {
      return false;
    }
    var PasswordFile = pathlib2.join(tempDir2, crypto2.randomBytes(20).toString("hex"));
    PasswordFileArray.push(PasswordFile);
    options.password = options.password.trim();
    if (options.password === "") {
      options.mustPass = true;
    }
    if (options.cipher && ciphers.indexOf(options.cipher) !== -1) {
      params.push("-" + options.cipher);
    }
    params.push("-pass" + options.passType);
    if (options.mustPass) {
      params.push("pass:" + options.password);
    } else {
      fs2.writeFileSync(PasswordFile, options.password);
      params.push("file:" + PasswordFile);
    }
    return true;
  };
  module.exports.deleteTempFiles = function(files, callback) {
    var rmFiles = [];
    if (typeof files === "string") {
      rmFiles.push(files);
    } else if (Array.isArray(files)) {
      rmFiles = files;
    } else {
      return callback(new Error("Unexcepted files parameter type; only string or array supported"));
    }
    var deleteSeries = function(list, finalCallback) {
      if (list.length) {
        var file = list.shift();
        var myCallback = function(err) {
          if (err && err.code === "ENOENT") {
            return deleteSeries(list, finalCallback);
          } else if (err) {
            return finalCallback(err);
          } else {
            return deleteSeries(list, finalCallback);
          }
        };
        if (file && typeof file === "string") {
          fs2.unlink(file, myCallback);
        } else {
          return deleteSeries(list, finalCallback);
        }
      } else {
        return finalCallback(null);
      }
    };
    deleteSeries(rmFiles, callback);
  };
})(helper$3);
var windows;
var hasRequiredWindows;
function requireWindows() {
  if (hasRequiredWindows)
    return windows;
  hasRequiredWindows = 1;
  windows = isexe2;
  isexe2.sync = sync2;
  var fs2 = require$$1;
  function checkPathExt(path2, options) {
    var pathext = options.pathExt !== void 0 ? options.pathExt : {}.PATHEXT;
    if (!pathext) {
      return true;
    }
    pathext = pathext.split(";");
    if (pathext.indexOf("") !== -1) {
      return true;
    }
    for (var i = 0; i < pathext.length; i++) {
      var p = pathext[i].toLowerCase();
      if (p && path2.substr(-p.length).toLowerCase() === p) {
        return true;
      }
    }
    return false;
  }
  function checkStat(stat, path2, options) {
    if (!stat.isSymbolicLink() && !stat.isFile()) {
      return false;
    }
    return checkPathExt(path2, options);
  }
  function isexe2(path2, options, cb) {
    fs2.stat(path2, function(er, stat) {
      cb(er, er ? false : checkStat(stat, path2, options));
    });
  }
  function sync2(path2, options) {
    return checkStat(fs2.statSync(path2), path2, options);
  }
  return windows;
}
var mode;
var hasRequiredMode;
function requireMode() {
  if (hasRequiredMode)
    return mode;
  hasRequiredMode = 1;
  mode = isexe2;
  isexe2.sync = sync2;
  var fs2 = require$$1;
  function isexe2(path2, options, cb) {
    fs2.stat(path2, function(er, stat) {
      cb(er, er ? false : checkStat(stat, options));
    });
  }
  function sync2(path2, options) {
    return checkStat(fs2.statSync(path2), options);
  }
  function checkStat(stat, options) {
    return stat.isFile() && checkMode(stat, options);
  }
  function checkMode(stat, options) {
    var mod = stat.mode;
    var uid = stat.uid;
    var gid = stat.gid;
    var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
    var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
    var u = parseInt("100", 8);
    var g = parseInt("010", 8);
    var o = parseInt("001", 8);
    var ug = u | g;
    var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
    return ret;
  }
  return mode;
}
var core;
if (process.platform === "win32" || commonjsGlobal.TESTING_WINDOWS) {
  core = requireWindows();
} else {
  core = requireMode();
}
var isexe_1 = isexe$1;
isexe$1.sync = sync;
function isexe$1(path2, options, cb) {
  if (typeof options === "function") {
    cb = options;
    options = {};
  }
  if (!cb) {
    if (typeof Promise !== "function") {
      throw new TypeError("callback not provided");
    }
    return new Promise(function(resolve, reject) {
      isexe$1(path2, options || {}, function(er, is) {
        if (er) {
          reject(er);
        } else {
          resolve(is);
        }
      });
    });
  }
  core(path2, options || {}, function(er, is) {
    if (er) {
      if (er.code === "EACCES" || options && options.ignoreErrors) {
        er = null;
        is = false;
      }
    }
    cb(er, is);
  });
}
function sync(path2, options) {
  try {
    return core.sync(path2, options || {});
  } catch (er) {
    if (options && options.ignoreErrors || er.code === "EACCES") {
      return false;
    } else {
      throw er;
    }
  }
}
const isWindows = process.platform === "win32" || {}.OSTYPE === "cygwin" || {}.OSTYPE === "msys";
const path = require$$1;
const COLON = isWindows ? ";" : ":";
const isexe = isexe_1;
const getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON;
  const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
    // windows always checks the cwd first
    ...isWindows ? [process.cwd()] : [],
    ...(opt.path || {}.PATH || /* istanbul ignore next: very unusual */
    "").split(colon)
  ];
  const pathExtExe = isWindows ? opt.pathExt || {}.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
  const pathExt = isWindows ? pathExtExe.split(colon) : [""];
  if (isWindows) {
    if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
      pathExt.unshift("");
  }
  return {
    pathEnv,
    pathExt,
    pathExtExe
  };
};
const which$1 = (cmd, opt, cb) => {
  if (typeof opt === "function") {
    cb = opt;
    opt = {};
  }
  if (!opt)
    opt = {};
  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
  const found = [];
  const step = (i) => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
    const pCmd = path.join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
    resolve(subStep(p, i, 0));
  });
  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1));
    const ext = pathExt[ii];
    isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext);
        else
          return resolve(p + ext);
      }
      return resolve(subStep(p, i, ii + 1));
    });
  });
  return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
};
const whichSync = (cmd, opt) => {
  opt = opt || {};
  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
  const found = [];
  for (let i = 0; i < pathEnv.length; i++) {
    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
    const pCmd = path.join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
    for (let j = 0; j < pathExt.length; j++) {
      const cur = p + pathExt[j];
      try {
        const is = isexe.sync(cur, { pathExt: pathExtExe });
        if (is) {
          if (opt.all)
            found.push(cur);
          else
            return cur;
        }
      } catch (ex) {
      }
    }
  }
  if (opt.all && found.length)
    return found;
  if (opt.nothrow)
    return null;
  throw getNotFoundError(cmd);
};
var which_1 = which$1;
which$1.sync = whichSync;
var helper$2 = helperExports;
var cpspawn = require$$1.spawn;
var pathlib = require$$1;
var fs = require$$1;
var osTmpdir = osTmpdir$1;
var crypto = require$$1;
var which = which_1;
var settings = {};
var tempDir = {}.PEMJS_TMPDIR || osTmpdir();
function set(option, value) {
  settings[option] = value;
}
function get(option) {
  return settings[option] || null;
}
function exec(params, searchStr, tmpfiles, callback) {
  if (!callback && typeof tmpfiles === "function") {
    callback = tmpfiles;
    tmpfiles = false;
  }
  spawnWrapper(params, tmpfiles, function(err, code, stdout, stderr) {
    var start, end;
    if (err) {
      return callback(err);
    }
    if (start = stdout.match(new RegExp("\\-+BEGIN " + searchStr + "\\-+$", "m"))) {
      start = start.index;
    } else {
      start = -1;
    }
    if (searchStr === "EC PARAMETERS") {
      searchStr = "EC PRIVATE KEY";
    }
    if (end = stdout.match(new RegExp("^\\-+END " + searchStr + "\\-+", "m"))) {
      end = end.index + end[0].length;
    } else {
      end = -1;
    }
    if (start >= 0 && end >= 0) {
      return callback(null, stdout.substring(start, end));
    } else {
      return callback(new Error(searchStr + " not found from openssl output:\n---stdout---\n" + stdout + "\n---stderr---\n" + stderr + "\ncode: " + code));
    }
  });
}
function execBinary(params, tmpfiles, callback) {
  if (!callback && typeof tmpfiles === "function") {
    callback = tmpfiles;
    tmpfiles = false;
  }
  spawnWrapper(params, tmpfiles, true, function(err, code, stdout, stderr) {
    if (err) {
      return callback(err);
    }
    return callback(null, stdout);
  });
}
function spawn(params, binary, callback) {
  var pathBin = get("pathOpenSSL") || {}.OPENSSL_BIN || "openssl";
  testOpenSSLPath(pathBin, function(err) {
    if (err) {
      return callback(err);
    }
    var openssl2 = cpspawn(pathBin, params);
    var stderr = "";
    var stdout = binary ? Buffer.alloc(0) : "";
    openssl2.stdout.on("data", function(data) {
      if (!binary) {
        stdout += data.toString("binary");
      } else {
        stdout = Buffer.concat([stdout, data]);
      }
    });
    openssl2.stderr.on("data", function(data) {
      stderr += data.toString("binary");
    });
    var needed = 2;
    var code = -1;
    var finished = false;
    var done = function(err2) {
      if (finished) {
        return;
      }
      if (err2) {
        finished = true;
        return callback(err2);
      }
      if (--needed < 1) {
        finished = true;
        if (code) {
          if (code === 2 && (stderr === "" || /depth lookup: unable to/.test(stderr))) {
            return callback(null, code, stdout, stderr);
          }
          return callback(new Error("Invalid openssl exit code: " + code + "\n% openssl " + params.join(" ") + "\n" + stderr), code);
        } else {
          return callback(null, code, stdout, stderr);
        }
      }
    };
    openssl2.on("error", done);
    openssl2.on("exit", function(ret) {
      code = ret;
      done();
    });
    openssl2.on("close", function() {
      stdout = binary ? stdout : Buffer.from(stdout, "binary").toString("utf-8");
      stderr = Buffer.from(stderr, "binary").toString("utf-8");
      done();
    });
  });
}
function spawnWrapper(params, tmpfiles, binary, callback) {
  if (!callback && typeof binary === "function") {
    callback = binary;
    binary = false;
  }
  var files = [];
  var delTempPWFiles = [];
  if (tmpfiles) {
    tmpfiles = [].concat(tmpfiles);
    var fpath, i;
    for (i = 0; i < params.length; i++) {
      if (params[i] === "--TMPFILE--") {
        fpath = pathlib.join(tempDir, crypto.randomBytes(20).toString("hex"));
        files.push({
          path: fpath,
          contents: tmpfiles.shift()
        });
        params[i] = fpath;
        delTempPWFiles.push(fpath);
      }
    }
  }
  var file;
  for (i = 0; i < files.length; i++) {
    file = files[i];
    fs.writeFileSync(file.path, file.contents);
  }
  spawn(params, binary, function(err, code, stdout, stderr) {
    helper$2.deleteTempFiles(delTempPWFiles, function(fsErr) {
      callback(err || fsErr, code, stdout, stderr);
    });
  });
}
function testOpenSSLPath(pathBin, callback) {
  which(pathBin, function(error) {
    if (error) {
      return callback(new Error("Could not find openssl on your system on this path: " + pathBin));
    }
    callback();
  });
}
spawn(["version"], false, function(err, code, stdout, stderr) {
  var text = String(stdout) + "\n" + String(stderr) + "\n" + String(err);
  var tmp = text.match(/^LibreSSL/i);
  set("openSslVersion", (tmp && tmp[0] ? "LibreSSL" : "openssl").toUpperCase());
});
var openssl$2 = {
  exec,
  execBinary,
  spawn,
  spawnWrapper,
  set,
  get
};
var convert$1 = {};
var openssl$1 = openssl$2;
var helper$1 = helperExports;
convert$1.PEM2DER = function(pathIN, pathOUT, type, callback) {
  if (!callback && typeof type === "function") {
    callback = type;
    type = "x509";
  }
  var params = [
    type,
    "-outform",
    "der",
    "-in",
    pathIN,
    "-out",
    pathOUT
  ];
  openssl$1.spawnWrapper(params, false, function(error, code) {
    if (error) {
      callback(error);
    } else {
      callback(null, code === 0);
    }
  });
};
convert$1.DER2PEM = function(pathIN, pathOUT, type, callback) {
  if (!callback && typeof type === "function") {
    callback = type;
    type = "x509";
  }
  var params = [
    type,
    "-inform",
    "der",
    "-in",
    pathIN,
    "-out",
    pathOUT
  ];
  openssl$1.spawnWrapper(params, false, function(error, code) {
    if (error) {
      callback(error);
    } else {
      callback(null, code === 0);
    }
  });
};
convert$1.PEM2P7B = function(pathBundleIN, pathOUT, callback) {
  var params = [
    "crl2pkcs7",
    "-nocrl",
    "-certfile",
    pathBundleIN.cert,
    "-out",
    pathOUT
  ];
  if (pathBundleIN.ca) {
    if (!Array.isArray(pathBundleIN.ca)) {
      pathBundleIN.ca = [pathBundleIN.ca];
    }
    pathBundleIN.ca.forEach(function(ca) {
      params.push("-certfile");
      params.push(ca);
    });
  }
  openssl$1.spawnWrapper(params, false, function(error, code) {
    if (error) {
      callback(error);
    } else {
      callback(null, code === 0);
    }
  });
};
convert$1.P7B2PEM = function(pathIN, pathOUT, callback) {
  var params = [
    "pkcs7",
    "-print_certs",
    "-in",
    pathIN,
    "-out",
    pathOUT
  ];
  openssl$1.spawnWrapper(params, false, function(error, code) {
    if (error) {
      callback(error);
    } else {
      callback(null, code === 0);
    }
  });
};
convert$1.PEM2PFX = function(pathBundleIN, pathOUT, password, callback) {
  var params = [
    "pkcs12",
    "-export",
    "-out",
    pathOUT,
    "-inkey",
    pathBundleIN.key,
    "-in",
    pathBundleIN.cert
  ];
  if (pathBundleIN.ca) {
    if (!Array.isArray(pathBundleIN.ca)) {
      pathBundleIN.ca = [pathBundleIN.ca];
    }
    pathBundleIN.ca.forEach(function(ca) {
      params.push("-certfile");
      params.push(ca);
    });
  }
  var delTempPWFiles = [];
  helper$1.createPasswordFile({ cipher: "", password, passType: "in" }, params, delTempPWFiles);
  helper$1.createPasswordFile({ cipher: "", password, passType: "out" }, params, delTempPWFiles);
  openssl$1.spawnWrapper(params, false, function(error, code) {
    function done(error2) {
      if (error2) {
        callback(error2);
      } else {
        callback(null, code === 0);
      }
    }
    helper$1.deleteTempFiles(delTempPWFiles, function(fsErr) {
      done(error || fsErr);
    });
  });
};
convert$1.PFX2PEM = function(pathIN, pathOUT, password, callback) {
  var params = [
    "pkcs12",
    "-in",
    pathIN,
    "-out",
    pathOUT,
    "-nodes"
  ];
  var delTempPWFiles = [];
  helper$1.createPasswordFile({ cipher: "", password, passType: "in" }, params, delTempPWFiles);
  helper$1.createPasswordFile({ cipher: "", password, passType: "out" }, params, delTempPWFiles);
  openssl$1.spawnWrapper(params, false, function(error, code) {
    function done(error2) {
      if (error2) {
        callback(error2);
      } else {
        callback(null, code === 0);
      }
    }
    helper$1.deleteTempFiles(delTempPWFiles, function(fsErr) {
      done(error || fsErr);
    });
  });
};
convert$1.P7B2PFX = function(pathBundleIN, pathOUT, password, callback) {
  var tmpfile = pathBundleIN.cert.replace(/\.[^.]+$/, ".cer");
  var params = [
    "pkcs7",
    "-print_certs",
    "-in",
    pathBundleIN.cert,
    "-out",
    tmpfile
  ];
  openssl$1.spawnWrapper(params, false, function(error, code) {
    if (error) {
      callback(error);
    } else {
      var params2 = [
        "pkcs12",
        "-export",
        "-in",
        tmpfile,
        "-inkey",
        pathBundleIN.key,
        "-out",
        pathOUT
      ];
      if (pathBundleIN.ca) {
        if (!Array.isArray(pathBundleIN.ca)) {
          pathBundleIN.ca = [pathBundleIN.ca];
        }
        pathBundleIN.ca.forEach(function(ca) {
          params2.push("-certfile");
          params2.push(ca);
        });
      }
      var delTempPWFiles = [tmpfile];
      helper$1.createPasswordFile({ cipher: "", password, passType: "in" }, params2, delTempPWFiles);
      helper$1.createPasswordFile({ cipher: "", password, passType: "out" }, params2, delTempPWFiles);
      openssl$1.spawnWrapper(params2, false, function(error2, code2) {
        function done(error3) {
          if (error3) {
            callback(error3);
          } else {
            callback(null, code2 === 0);
          }
        }
        helper$1.deleteTempFiles(delTempPWFiles, function(fsErr) {
          done(error2 || fsErr);
        });
      });
    }
  });
};
const { promisify } = promisify$2;
var net = require$$1;
var helper = helperExports;
var openssl = openssl$2;
var createPrivateKey_1 = pem$1.createPrivateKey = createPrivateKey;
var createDhparam_1 = pem$1.createDhparam = createDhparam;
var createEcparam_1 = pem$1.createEcparam = createEcparam;
var createCSR_1 = pem$1.createCSR = createCSR;
var createCertificate_1 = pem$1.createCertificate = createCertificate;
var readCertificateInfo_1 = pem$1.readCertificateInfo = readCertificateInfo;
var getPublicKey_1 = pem$1.getPublicKey = getPublicKey;
var getFingerprint_1 = pem$1.getFingerprint = getFingerprint;
var getModulus_1 = pem$1.getModulus = getModulus;
var getDhparamInfo_1 = pem$1.getDhparamInfo = getDhparamInfo;
var createPkcs12_1 = pem$1.createPkcs12 = createPkcs12;
var readPkcs12_1 = pem$1.readPkcs12 = readPkcs12;
var verifySigningChain_1 = pem$1.verifySigningChain = verifySigningChain;
var checkCertificate_1 = pem$1.checkCertificate = checkCertificate;
var checkPkcs12_1 = pem$1.checkPkcs12 = checkPkcs12;
var config_1 = pem$1.config = config;
var convert = pem$1.convert = convert$1;
var KEY_START = "-----BEGIN PRIVATE KEY-----";
var KEY_END = "-----END PRIVATE KEY-----";
var RSA_KEY_START = "-----BEGIN RSA PRIVATE KEY-----";
var RSA_KEY_END = "-----END RSA PRIVATE KEY-----";
var ENCRYPTED_KEY_START = "-----BEGIN ENCRYPTED PRIVATE KEY-----";
var ENCRYPTED_KEY_END = "-----END ENCRYPTED PRIVATE KEY-----";
var CERT_START = "-----BEGIN CERTIFICATE-----";
var CERT_END = "-----END CERTIFICATE-----";
function createPrivateKey(keyBitsize, options, callback) {
  if (!callback && !options && typeof keyBitsize === "function") {
    callback = keyBitsize;
    keyBitsize = void 0;
    options = {};
  } else if (!callback && keyBitsize && typeof options === "function") {
    callback = options;
    options = {};
  }
  keyBitsize = Number(keyBitsize) || 2048;
  var params = ["genrsa"];
  var delTempPWFiles = [];
  if (options && options.cipher && Number(helper.ciphers.indexOf(options.cipher)) !== -1 && options.password) {
    helper.createPasswordFile({ cipher: options.cipher, password: options.password, passType: "out" }, params, delTempPWFiles);
  }
  params.push(keyBitsize);
  openssl.exec(params, "RSA PRIVATE KEY", function(sslErr, key) {
    function done(err) {
      if (err) {
        return callback(err);
      }
      callback(null, {
        key
      });
    }
    helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
      done(sslErr || fsErr);
    });
  });
}
function createDhparam(keyBitsize, callback) {
  if (!callback && typeof keyBitsize === "function") {
    callback = keyBitsize;
    keyBitsize = void 0;
  }
  keyBitsize = Number(keyBitsize) || 512;
  var params = [
    "dhparam",
    "-outform",
    "PEM",
    keyBitsize
  ];
  openssl.exec(params, "DH PARAMETERS", function(error, dhparam) {
    if (error) {
      return callback(error);
    }
    return callback(null, {
      dhparam
    });
  });
}
function createEcparam(keyName, paramEnc, noOut, callback) {
  if (!callback && typeof noOut === "undefined" && !paramEnc && typeof keyName === "function") {
    callback = keyName;
    keyName = void 0;
  } else if (!callback && typeof noOut === "undefined" && keyName && typeof paramEnc === "function") {
    callback = paramEnc;
    paramEnc = void 0;
  } else if (!callback && typeof noOut === "function" && keyName && paramEnc) {
    callback = noOut;
    noOut = void 0;
  }
  keyName = keyName || "secp256k1";
  paramEnc = paramEnc || "explicit";
  noOut = noOut || false;
  var params = [
    "ecparam",
    "-name",
    keyName,
    "-genkey",
    "-param_enc",
    paramEnc
  ];
  var searchString = "EC PARAMETERS";
  if (noOut) {
    params.push("-noout");
    searchString = "EC PRIVATE KEY";
  }
  openssl.exec(params, searchString, function(error, ecparam) {
    if (error) {
      return callback(error);
    }
    return callback(null, {
      ecparam
    });
  });
}
function createCSR(options, callback) {
  if (!callback && typeof options === "function") {
    callback = options;
    options = void 0;
  }
  options = options || {};
  if (options.commonName && (net.isIPv4(options.commonName) || net.isIPv6(options.commonName))) {
    if (!options.altNames) {
      options.altNames = [options.commonName];
    } else if (options.altNames.indexOf(options.commonName) === -1) {
      options.altNames = options.altNames.concat([options.commonName]);
    }
  }
  if (!options.clientKey) {
    createPrivateKey(options.keyBitsize || 2048, function(error, keyData) {
      if (error) {
        return callback(error);
      }
      options.clientKey = keyData.key;
      createCSR(options, callback);
    });
    return;
  }
  var params = [
    "req",
    "-new",
    "-" + (options.hash || "sha256")
  ];
  if (options.csrConfigFile) {
    params.push("-config");
    params.push(options.csrConfigFile);
  } else {
    params.push("-subj");
    params.push(generateCSRSubject(options));
  }
  params.push("-key");
  params.push("--TMPFILE--");
  var tmpfiles = [options.clientKey];
  var config2 = null;
  if (options.altNames && Array.isArray(options.altNames) && options.altNames.length) {
    params.push("-extensions");
    params.push("v3_req");
    params.push("-config");
    params.push("--TMPFILE--");
    var altNamesRep = [];
    for (var i = 0; i < options.altNames.length; i++) {
      altNamesRep.push((net.isIP(options.altNames[i]) ? "IP" : "DNS") + "." + (i + 1) + " = " + options.altNames[i]);
    }
    tmpfiles.push(config2 = [
      "[req]",
      "req_extensions = v3_req",
      "distinguished_name = req_distinguished_name",
      "[v3_req]",
      "subjectAltName = @alt_names",
      "[alt_names]",
      altNamesRep.join("\n"),
      "[req_distinguished_name]",
      "commonName = Common Name",
      "commonName_max = 64"
    ].join("\n"));
  } else if (options.config) {
    config2 = options.config;
  }
  var delTempPWFiles = [];
  if (options.clientKeyPassword) {
    helper.createPasswordFile({ cipher: "", password: options.clientKeyPassword, passType: "in" }, params, delTempPWFiles);
  }
  openssl.exec(params, "CERTIFICATE REQUEST", tmpfiles, function(sslErr, data) {
    function done(err) {
      if (err) {
        return callback(err);
      }
      callback(null, {
        csr: data,
        config: config2,
        clientKey: options.clientKey
      });
    }
    helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
      done(sslErr || fsErr);
    });
  });
}
function createCertificate(options, callback) {
  if (!callback && typeof options === "function") {
    callback = options;
    options = void 0;
  }
  options = options || {};
  if (!options.csr) {
    createCSR(options, function(error, keyData) {
      if (error) {
        return callback(error);
      }
      options.csr = keyData.csr;
      options.config = keyData.config;
      options.clientKey = keyData.clientKey;
      createCertificate(options, callback);
    });
    return;
  }
  if (!options.clientKey) {
    options.clientKey = "";
  }
  if (!options.serviceKey) {
    if (options.selfSigned) {
      options.serviceKey = options.clientKey;
    } else {
      createPrivateKey(options.keyBitsize || 2048, function(error, keyData) {
        if (error) {
          return callback(error);
        }
        options.serviceKey = keyData.key;
        createCertificate(options, callback);
      });
      return;
    }
  }
  readCertificateInfo(options.csr, function(error2, data2) {
    if (error2) {
      return callback(error2);
    }
    var params = [
      "x509",
      "-req",
      "-" + (options.hash || "sha256"),
      "-days",
      Number(options.days) || "365",
      "-in",
      "--TMPFILE--"
    ];
    var tmpfiles = [options.csr];
    var delTempPWFiles = [];
    if (options.serviceCertificate) {
      params.push("-CA");
      params.push("--TMPFILE--");
      params.push("-CAkey");
      params.push("--TMPFILE--");
      if (options.serial) {
        params.push("-set_serial");
        if (helper.isNumber(options.serial)) {
          params.push("0x" + ("0000000000000000000000000000000000000000" + options.serial.toString(16)).slice(-40));
        } else {
          if (helper.isHex(options.serial)) {
            if (options.serial.startsWith("0x")) {
              options.serial = options.serial.substring(2, options.serial.length);
            }
            params.push("0x" + ("0000000000000000000000000000000000000000" + options.serial).slice(-40));
          } else {
            params.push("0x" + ("0000000000000000000000000000000000000000" + helper.toHex(options.serial)).slice(-40));
          }
        }
      } else {
        params.push("-CAcreateserial");
        if (options.serialFile) {
          params.push("-CAserial");
          params.push(options.serialFile + ".srl");
        }
      }
      if (options.serviceKeyPassword) {
        helper.createPasswordFile({ cipher: "", password: options.serviceKeyPassword, passType: "in" }, params, delTempPWFiles);
      }
      tmpfiles.push(options.serviceCertificate);
      tmpfiles.push(options.serviceKey);
    } else {
      params.push("-signkey");
      params.push("--TMPFILE--");
      if (options.serviceKeyPassword) {
        helper.createPasswordFile({ cipher: "", password: options.serviceKeyPassword, passType: "in" }, params, delTempPWFiles);
      }
      tmpfiles.push(options.serviceKey);
    }
    if (options.config) {
      params.push("-extensions");
      params.push("v3_req");
      params.push("-extfile");
      params.push("--TMPFILE--");
      tmpfiles.push(options.config);
    } else if (options.extFile) {
      params.push("-extfile");
      params.push(options.extFile);
    } else {
      var altNamesRep = [];
      if (data2 && data2.san) {
        for (var i = 0; i < data2.san.dns.length; i++) {
          altNamesRep.push("DNS." + (i + 1) + " = " + data2.san.dns[i]);
        }
        for (var i2 = 0; i2 < data2.san.ip.length; i2++) {
          altNamesRep.push("IP." + (i2 + 1) + " = " + data2.san.ip[i2]);
        }
        for (var i3 = 0; i3 < data2.san.email.length; i3++) {
          altNamesRep.push("email." + (i3 + 1) + " = " + data2.san.email[i3]);
        }
        params.push("-extensions");
        params.push("v3_req");
        params.push("-extfile");
        params.push("--TMPFILE--");
        tmpfiles.push([
          "[v3_req]",
          "subjectAltName = @alt_names",
          "[alt_names]",
          altNamesRep.join("\n")
        ].join("\n"));
      }
    }
    if (options.clientKeyPassword) {
      helper.createPasswordFile({ cipher: "", password: options.clientKeyPassword, passType: "in" }, params, delTempPWFiles);
    }
    openssl.exec(params, "CERTIFICATE", tmpfiles, function(sslErr, data) {
      function done(err) {
        if (err) {
          return callback(err);
        }
        var response = {
          csr: options.csr,
          clientKey: options.clientKey,
          certificate: data,
          serviceKey: options.serviceKey
        };
        return callback(null, response);
      }
      helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
        done(sslErr || fsErr);
      });
    });
  });
}
function getPublicKey(certificate, callback) {
  if (!callback && typeof certificate === "function") {
    callback = certificate;
    certificate = void 0;
  }
  certificate = (certificate || "").toString();
  var params;
  if (certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)) {
    params = [
      "req",
      "-in",
      "--TMPFILE--",
      "-pubkey",
      "-noout"
    ];
  } else if (certificate.match(/BEGIN RSA PRIVATE KEY/) || certificate.match(/BEGIN PRIVATE KEY/)) {
    params = [
      "rsa",
      "-in",
      "--TMPFILE--",
      "-pubout"
    ];
  } else {
    params = [
      "x509",
      "-in",
      "--TMPFILE--",
      "-pubkey",
      "-noout"
    ];
  }
  openssl.exec(params, "PUBLIC KEY", certificate, function(error, key) {
    if (error) {
      return callback(error);
    }
    return callback(null, {
      publicKey: key
    });
  });
}
function readCertificateInfo(certificate, callback) {
  if (!callback && typeof certificate === "function") {
    callback = certificate;
    certificate = void 0;
  }
  certificate = (certificate || "").toString();
  var isMatch = certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/);
  var type = isMatch ? "req" : "x509";
  var params = [
    type,
    "-noout",
    "-nameopt",
    "RFC2253,sep_multiline,space_eq,-esc_msb,utf8",
    "-text",
    "-in",
    "--TMPFILE--"
  ];
  openssl.spawnWrapper(params, certificate, function(err, code, stdout, stderr) {
    if (err) {
      return callback(err);
    } else if (stderr) {
      return callback(stderr);
    }
    return fetchCertificateData(stdout, callback);
  });
}
function getModulus(certificate, password, hash, callback) {
  if (!callback && !hash && typeof password === "function") {
    callback = password;
    password = void 0;
    hash = false;
  } else if (!callback && hash && typeof hash === "function") {
    callback = hash;
    hash = false;
  }
  if (hash && hash !== "md5") {
    hash = false;
  }
  certificate = Buffer.isBuffer(certificate) && certificate.toString() || certificate;
  var type = "";
  if (certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)) {
    type = "req";
  } else if (certificate.match(/BEGIN RSA PRIVATE KEY/) || certificate.match(/BEGIN PRIVATE KEY/)) {
    type = "rsa";
  } else {
    type = "x509";
  }
  var params = [
    type,
    "-noout",
    "-modulus",
    "-in",
    "--TMPFILE--"
  ];
  var delTempPWFiles = [];
  if (password) {
    helper.createPasswordFile({ cipher: "", password, passType: "in" }, params, delTempPWFiles);
  }
  openssl.spawnWrapper(params, certificate, function(sslErr, code, stdout, stderr) {
    function done(err) {
      if (err) {
        return callback(err);
      }
      var match = stdout.match(/Modulus=([0-9a-fA-F]+)$/m);
      if (match) {
        return callback(null, {
          modulus: hash ? commonjsRequire(hash)(match[1]) : match[1]
        });
      } else {
        return callback(new Error("No modulus"));
      }
    }
    helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
      done(sslErr || fsErr || stderr);
    });
  });
}
function getDhparamInfo(dh, callback) {
  dh = Buffer.isBuffer(dh) && dh.toString() || dh;
  var params = [
    "dhparam",
    "-text",
    "-in",
    "--TMPFILE--"
  ];
  openssl.spawnWrapper(params, dh, function(err, code, stdout, stderr) {
    if (err) {
      return callback(err);
    } else if (stderr) {
      return callback(stderr);
    }
    var result = {};
    var match = stdout.match(/Parameters: \((\d+) bit\)/);
    if (match) {
      result.size = Number(match[1]);
    }
    var prime = "";
    stdout.split("\n").forEach(function(line) {
      if (/\s+([0-9a-f][0-9a-f]:)+[0-9a-f]?[0-9a-f]?/g.test(line)) {
        prime += line.trim();
      }
    });
    if (prime) {
      result.prime = prime;
    }
    if (!match && !prime) {
      return callback(new Error("No DH info found"));
    }
    return callback(null, result);
  });
}
function config(options) {
  Object.keys(options).forEach(function(k) {
    openssl.set(k, options[k]);
  });
}
function getFingerprint(certificate, hash, callback) {
  if (!callback && typeof hash === "function") {
    callback = hash;
    hash = void 0;
  }
  hash = hash || "sha1";
  var params = [
    "x509",
    "-in",
    "--TMPFILE--",
    "-fingerprint",
    "-noout",
    "-" + hash
  ];
  openssl.spawnWrapper(params, certificate, function(err, code, stdout, stderr) {
    if (err) {
      return callback(err);
    } else if (stderr) {
      return callback(stderr);
    }
    var match = stdout.match(/Fingerprint=([0-9a-fA-F:]+)$/m);
    if (match) {
      return callback(null, {
        fingerprint: match[1]
      });
    } else {
      return callback(new Error("No fingerprint"));
    }
  });
}
function createPkcs12(key, certificate, password, options, callback) {
  if (!callback && typeof options === "function") {
    callback = options;
    options = {};
  }
  var params = ["pkcs12", "-export"];
  var delTempPWFiles = [];
  if (options.cipher && options.clientKeyPassword) {
    helper.createPasswordFile({ cipher: options.cipher, password: options.clientKeyPassword, passType: "in" }, params, delTempPWFiles);
  }
  helper.createPasswordFile({ cipher: "", password, passType: "word" }, params, delTempPWFiles);
  params.push("-in");
  params.push("--TMPFILE--");
  params.push("-inkey");
  params.push("--TMPFILE--");
  var tmpfiles = [certificate, key];
  if (options.certFiles) {
    tmpfiles.push(options.certFiles.join(""));
    params.push("-certfile");
    params.push("--TMPFILE--");
  }
  openssl.execBinary(params, tmpfiles, function(sslErr, pkcs12) {
    function done(err) {
      if (err) {
        return callback(err);
      }
      return callback(null, {
        pkcs12
      });
    }
    helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
      done(sslErr || fsErr);
    });
  });
}
function readPkcs12(bufferOrPath, options, callback) {
  if (!callback && typeof options === "function") {
    callback = options;
    options = {};
  }
  options.p12Password = options.p12Password || "";
  var tmpfiles = [];
  var delTempPWFiles = [];
  var args = ["pkcs12", "-in", bufferOrPath];
  helper.createPasswordFile({ cipher: "", password: options.p12Password, passType: "in" }, args, delTempPWFiles);
  if (Buffer.isBuffer(bufferOrPath)) {
    tmpfiles = [bufferOrPath];
    args[2] = "--TMPFILE--";
  }
  if (options.clientKeyPassword) {
    helper.createPasswordFile({ cipher: "", password: options.clientKeyPassword, passType: "out" }, args, delTempPWFiles);
  } else {
    args.push("-nodes");
  }
  openssl.execBinary(args, tmpfiles, function(sslErr, stdout) {
    function done(err) {
      var keybundle = {};
      if (err && err.message.indexOf("No such file or directory") !== -1) {
        err.code = "ENOENT";
      }
      if (!err) {
        var certs = readFromString(stdout, CERT_START, CERT_END);
        keybundle.cert = certs.shift();
        keybundle.ca = certs;
        keybundle.key = readFromString(stdout, KEY_START, KEY_END).pop();
        if (keybundle.key) {
          return openssl.exec(["rsa", "-in", "--TMPFILE--"], "RSA PRIVATE KEY", [keybundle.key], function(err2, key) {
            keybundle.key = key;
            return callback(err2, keybundle);
          });
        }
        if (options.clientKeyPassword) {
          keybundle.key = readFromString(stdout, ENCRYPTED_KEY_START, ENCRYPTED_KEY_END).pop();
        } else {
          keybundle.key = readFromString(stdout, RSA_KEY_START, RSA_KEY_END).pop();
        }
      }
      return callback(err, keybundle);
    }
    helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
      done(sslErr || fsErr);
    });
  });
}
function checkCertificate(certificate, passphrase, callback) {
  var params;
  var delTempPWFiles = [];
  if (!callback && typeof passphrase === "function") {
    callback = passphrase;
    passphrase = void 0;
  }
  certificate = (certificate || "").toString();
  if (certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)) {
    params = ["req", "-text", "-noout", "-verify", "-in", "--TMPFILE--"];
  } else if (certificate.match(/BEGIN RSA PRIVATE KEY/) || certificate.match(/BEGIN PRIVATE KEY/)) {
    params = ["rsa", "-noout", "-check", "-in", "--TMPFILE--"];
  } else {
    params = ["x509", "-text", "-noout", "-in", "--TMPFILE--"];
  }
  if (passphrase) {
    helper.createPasswordFile({ cipher: "", password: passphrase, passType: "in" }, params, delTempPWFiles);
  }
  openssl.spawnWrapper(params, certificate, function(sslErr, code, stdout, stderr) {
    function done(err) {
      if (err && err.toString().trim() !== "verify OK") {
        return callback(err);
      }
      var result;
      switch (params[0]) {
        case "rsa":
          result = /^Rsa key ok$/i.test(stdout.trim());
          break;
        default:
          result = /Signature Algorithm/im.test(stdout);
          break;
      }
      callback(null, result);
    }
    helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
      done(sslErr || fsErr || stderr);
    });
  });
}
function checkPkcs12(bufferOrPath, passphrase, callback) {
  if (!callback && typeof passphrase === "function") {
    callback = passphrase;
    passphrase = "";
  }
  var tmpfiles = [];
  var delTempPWFiles = [];
  var args = ["pkcs12", "-info", "-in", bufferOrPath, "-noout", "-maciter", "-nodes"];
  helper.createPasswordFile({ cipher: "", password: passphrase, passType: "in" }, args, delTempPWFiles);
  if (Buffer.isBuffer(bufferOrPath)) {
    tmpfiles = [bufferOrPath];
    args[3] = "--TMPFILE--";
  }
  openssl.spawnWrapper(args, tmpfiles, function(sslErr, code, stdout, stderr) {
    function done(err) {
      if (err) {
        return callback(err);
      }
      callback(null, /MAC verified OK/im.test(stderr) || !/MAC verified OK/im.test(stderr) && !/Mac verify error/im.test(stderr));
    }
    helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
      done(sslErr || fsErr);
    });
  });
}
function verifySigningChain(certificate, ca, callback) {
  if (!callback && typeof ca === "function") {
    callback = ca;
    ca = void 0;
  }
  if (!Array.isArray(certificate)) {
    certificate = [certificate];
  }
  if (!Array.isArray(ca) && ca !== void 0) {
    if (ca !== "") {
      ca = [ca];
    }
  }
  var files = [];
  if (ca !== void 0) {
    files.push(ca.join("\n"));
  }
  files.push(certificate.join("\n"));
  var params = ["verify"];
  if (ca !== void 0) {
    params.push("-CAfile");
    params.push("--TMPFILE--");
  }
  params.push("--TMPFILE--");
  openssl.spawnWrapper(params, files, function(err, code, stdout, stderr) {
    if (err) {
      return callback(err);
    }
    callback(null, stdout.trim().slice(-4) === ": OK");
  });
}
function fetchCertificateData(certData, callback) {
  try {
    certData = (certData || "").toString();
    var serial, subject, tmp, issuer;
    var certValues = {
      issuer: {}
    };
    var validity = {};
    var san;
    var ky, i;
    if ((serial = certData.match(/\s*Serial Number:\r?\n?\s*([^\r\n]*)\r?\n\s*\b/)) && serial.length > 1) {
      certValues.serial = serial[1];
    }
    if ((subject = certData.match(/\s*Subject:\r?\n(\s*(([a-zA-Z0-9.]+)\s=\s[^\r\n]+\r?\n))*\s*\b/)) && subject.length > 1) {
      subject = subject[0];
      tmp = matchAll(subject, /\s([a-zA-Z0-9.]+)\s=\s([^\r\n].*)/g);
      if (tmp) {
        for (i = 0; i < tmp.length; i++) {
          ky = tmp[i][1].trim();
          if (ky.match("(C|ST|L|O|OU|CN|emailAddress|DC)") || ky === "") {
            continue;
          }
          certValues[ky] = tmp[i][2].trim();
        }
      }
      tmp = subject.match(/\sC\s=\s([^\r\n].*?)[\r\n]/);
      certValues.country = tmp && tmp[1] || "";
      tmp = subject.match(/\sST\s=\s([^\r\n].*?)[\r\n]/);
      certValues.state = tmp && tmp[1] || "";
      tmp = subject.match(/\sL\s=\s([^\r\n].*?)[\r\n]/);
      certValues.locality = tmp && tmp[1] || "";
      tmp = matchAll(subject, /\sO\s=\s([^\r\n].*)/g);
      certValues.organization = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0;
      }).sort(function(t, n) {
        return t[1].length - n[1].length;
      }).map(function(t) {
        return t[1];
      }) : tmp[0][1] : "";
      tmp = matchAll(subject, /\sOU\s=\s([^\r\n].*)/g);
      certValues.organizationUnit = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0;
      }).sort(function(t, n) {
        return t[1].length - n[1].length;
      }).map(function(t) {
        return t[1];
      }) : tmp[0][1] : "";
      tmp = matchAll(subject, /\sCN\s=\s([^\r\n].*)/g);
      certValues.commonName = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0;
      }).sort(function(t, n) {
        return t[1].length - n[1].length;
      }).map(function(t) {
        return t[1];
      }) : tmp[0][1] : "";
      tmp = matchAll(subject, /emailAddress\s=\s([^\r\n].*)/g);
      certValues.emailAddress = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0;
      }).sort(function(t, n) {
        return t[1].length - n[1].length;
      }).map(function(t) {
        return t[1];
      }) : tmp[0][1] : "";
      tmp = matchAll(subject, /\sDC\s=\s([^\r\n].*)/g);
      certValues.dc = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0;
      }).sort(function(t, n) {
        return t[1].length - n[1].length;
      }).map(function(t) {
        return t[1];
      }) : tmp[0][1] : "";
    }
    if ((issuer = certData.match(/\s*Issuer:\r?\n(\s*([a-zA-Z0-9.]+)\s=\s[^\r\n].*\r?\n)*\s*\b/)) && issuer.length > 1) {
      issuer = issuer[0];
      tmp = matchAll(issuer, /\s([a-zA-Z0-9.]+)\s=\s([^\r\n].*)/g);
      for (i = 0; i < tmp.length; i++) {
        ky = tmp[i][1].toString();
        if (ky.match("(C|ST|L|O|OU|CN|emailAddress|DC)")) {
          continue;
        }
        certValues.issuer[ky] = tmp[i][2].toString();
      }
      tmp = issuer.match(/\sC\s=\s([^\r\n].*?)[\r\n]/);
      certValues.issuer.country = tmp && tmp[1] || "";
      tmp = issuer.match(/\sST\s=\s([^\r\n].*?)[\r\n]/);
      certValues.issuer.state = tmp && tmp[1] || "";
      tmp = issuer.match(/\sL\s=\s([^\r\n].*?)[\r\n]/);
      certValues.issuer.locality = tmp && tmp[1] || "";
      tmp = matchAll(issuer, /\sO\s=\s([^\r\n].*)/g);
      certValues.issuer.organization = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0;
      }).sort(function(t, n) {
        return t[1].length - n[1].length;
      }).map(function(t) {
        return t[1];
      }) : tmp[0][1] : "";
      tmp = matchAll(issuer, /\sOU\s=\s([^\r\n].*)/g);
      certValues.issuer.organizationUnit = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0;
      }).sort(function(t, n) {
        return t[1].length - n[1].length;
      }).map(function(t) {
        return t[1];
      }) : tmp[0][1] : "";
      tmp = matchAll(issuer, /\sCN\s=\s([^\r\n].*)/g);
      certValues.issuer.commonName = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0;
      }).sort(function(t, n) {
        return t[1].length - n[1].length;
      }).map(function(t) {
        return t[1];
      }) : tmp[0][1] : "";
      tmp = matchAll(issuer, /\sDC\s=\s([^\r\n].*)/g);
      certValues.issuer.dc = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
        var e = t[1].toUpperCase();
        var r = n[1].toUpperCase();
        return r > e ? -1 : e > r ? 1 : 0;
      }).sort(function(t, n) {
        return t[1].length - n[1].length;
      }).map(function(t) {
        return t[1];
      }) : tmp[0][1] : "";
    }
    if ((san = certData.match(/X509v3 Subject Alternative Name: \r?\n([^\r\n]*)\r?\n/)) && san.length > 1) {
      san = san[1].trim() + "\n";
      certValues.san = {};
      tmp = pregMatchAll("DNS:([^,\\r\\n].*?)[,\\r\\n\\s]", san);
      certValues.san.dns = tmp || "";
      tmp = pregMatchAll("IP Address:([^,\\r\\n].*?)[,\\r\\n\\s]", san);
      certValues.san.ip = tmp || "";
      tmp = pregMatchAll("email:([^,\\r\\n].*?)[,\\r\\n\\s]", san);
      certValues.san.email = tmp || "";
    }
    if ((tmp = certData.match(/Not Before\s?:\s?([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      validity.start = Date.parse(tmp && tmp[1] || "");
    }
    if ((tmp = certData.match(/Not After\s?:\s?([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      validity.end = Date.parse(tmp && tmp[1] || "");
    }
    if (validity.start && validity.end) {
      certValues.validity = validity;
    }
    if ((tmp = certData.match(/Signature Algorithm: ([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      certValues.signatureAlgorithm = tmp && tmp[1] || "";
    }
    if ((tmp = certData.match(/Public[ -]Key: ([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      certValues.publicKeySize = (tmp && tmp[1] || "").replace(/[()]/g, "");
    }
    if ((tmp = certData.match(/Public Key Algorithm: ([^\r\n]*)\r?\n/)) && tmp.length > 1) {
      certValues.publicKeyAlgorithm = tmp && tmp[1] || "";
    }
    callback(null, certValues);
  } catch (err) {
    callback(err);
  }
}
function matchAll(str, regexp) {
  var matches = [];
  str.replace(regexp, function() {
    var arr = [].slice.call(arguments, 0);
    var extras = arr.splice(-2);
    arr.index = extras[0];
    arr.input = extras[1];
    matches.push(arr);
  });
  return matches.length ? matches : null;
}
function pregMatchAll(regex, haystack) {
  var globalRegex = new RegExp(regex, "g");
  var globalMatch = haystack.match(globalRegex) || [];
  var matchArray = [];
  var nonGlobalRegex, nonGlobalMatch;
  for (var i = 0; i < globalMatch.length; i++) {
    nonGlobalRegex = new RegExp(regex);
    nonGlobalMatch = globalMatch[i].match(nonGlobalRegex);
    matchArray.push(nonGlobalMatch[1]);
  }
  return matchArray;
}
function generateCSRSubject(options) {
  options = options || {};
  var csrData = {
    C: options.country || options.C,
    ST: options.state || options.ST,
    L: options.locality || options.L,
    O: options.organization || options.O,
    OU: options.organizationUnit || options.OU,
    CN: options.commonName || options.CN || "localhost",
    DC: options.dc || options.DC || "",
    emailAddress: options.emailAddress
  };
  var csrBuilder = Object.keys(csrData).map(function(key) {
    if (csrData[key]) {
      if (typeof csrData[key] === "object" && csrData[key].length >= 1) {
        var tmpStr = "";
        csrData[key].map(function(o) {
          tmpStr += "/" + key + "=" + o.replace(/[^\w .*\-,@']+/g, " ").trim();
        });
        return tmpStr;
      } else {
        return "/" + key + "=" + csrData[key].replace(/[^\w .*\-,@']+/g, " ").trim();
      }
    }
  });
  return csrBuilder.join("");
}
function readFromString(string, start, end) {
  if (Buffer.isBuffer(string)) {
    string = string.toString("utf8");
  }
  var output = [];
  if (!string) {
    return output;
  }
  var offset = string.indexOf(start);
  while (offset !== -1) {
    string = string.substring(offset);
    var endOffset = string.indexOf(end);
    if (endOffset === -1) {
      break;
    }
    endOffset += end.length;
    output.push(string.substring(0, endOffset));
    offset = string.indexOf(start, endOffset);
  }
  return output;
}
var promisified = pem$1.promisified = {
  createPrivateKey: promisify(createPrivateKey),
  createDhparam: promisify(createDhparam),
  createEcparam: promisify(createEcparam),
  createCSR: promisify(createCSR),
  createCertificate: promisify(createCertificate),
  readCertificateInfo: promisify(readCertificateInfo),
  getPublicKey: promisify(getPublicKey),
  getFingerprint: promisify(getFingerprint),
  getModulus: promisify(getModulus),
  getDhparamInfo: promisify(getDhparamInfo),
  createPkcs12: promisify(createPkcs12),
  readPkcs12: promisify(readPkcs12),
  verifySigningChain: promisify(verifySigningChain),
  checkCertificate: promisify(checkCertificate),
  checkPkcs12: promisify(checkPkcs12)
};
const pem = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  checkCertificate: checkCertificate_1,
  checkPkcs12: checkPkcs12_1,
  config: config_1,
  convert,
  createCSR: createCSR_1,
  createCertificate: createCertificate_1,
  createDhparam: createDhparam_1,
  createEcparam: createEcparam_1,
  createPkcs12: createPkcs12_1,
  createPrivateKey: createPrivateKey_1,
  default: pem$1,
  getDhparamInfo: getDhparamInfo_1,
  getFingerprint: getFingerprint_1,
  getModulus: getModulus_1,
  getPublicKey: getPublicKey_1,
  promisified,
  readCertificateInfo: readCertificateInfo_1,
  readPkcs12: readPkcs12_1,
  verifySigningChain: verifySigningChain_1
}, [pem$1]);
export {
  pem as p
};
