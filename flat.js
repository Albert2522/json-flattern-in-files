fs = require('fs');

if (process.argv.length !== 3) {
  throw "Please provide parent file path correctly";
}

console.log(process.argv[2]);
console.log(process.argv.length);
let parent = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

class JsonFlattener {
  constructor() {
    this.flatFiles = {};
  }

  getMeta(obj) {

  }

  getSingular(string) {
    
  }

  flatJson(parent, parentMeta, path) {
    let obj = {};
    Object.keys(parentMeta).forEach(key => {
      obj[key] = parentMeta[key];
    })
    Object.keys(parent).forEach(key => {
      if (typeof parent[key] === "string") {
        obj[key] = parent[key];
      }
    })
    let newMeta = this.getMeta(obj);

    Object.keys(parent).forEach(key => {
      let tmp_obj = {};
      if (Array.isArray(parent[key])) {
        parent[key].forEach((childKey, index) => {
          newMeta["__index"] = index;
          path.push(getSingular(key));
          flatJson(parent[key][childKey], newMeta, path);
          delete newMeta["__index"]
          path.pop();
        })
        return;
      }

      if (typeof parent[key] === "object") {
        path.push(getSingular(key));
        flatJson(parent[key], newMeta, path);
        path.pop();
      }
    })
    let fileName = path.join('_');
    if (!this.flatFiles[fileName]) {
      this.flatFiles[fileName] = [ ];
    }
    this.flatFiles[fileName].push(obj);
  }

}
