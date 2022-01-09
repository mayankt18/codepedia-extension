const vscode = require("vscode");
const axios = require("axios");
// var FileSaver = require("file-saver");
const fs = require("fs");

// import { saveAs, File } from "file-saver";
/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const res = await axios.get(
    "http://codepedia.herokuapp.com/get-snippet-data/"
  );
  console.log(res.data);
  const articles = res.data.data.map((article) => {
    return {
      label: article.language,
      description: article.description,
      detail: article.body,
    };
  });
  console.log(articles);

  let disposable = vscode.commands.registerCommand(
    "wds-blog-search.searchWdsBlog",
    async function () {
      const article = await vscode.window.showQuickPick(articles, {
        matchOnDetail: true,
      });

      if (article == null) return;

      var content = {
        "cpp snippets": {
          prefix: "longinput",
          body: [
            "#include<bits/stdc++.h>",
            "using namespace std;",
            "#define int long long",
            "",
            "void sync()",
            "{",
            "	ios_base::sync_with_stdio(false);",
            "	cin.tie(NULL);",
            "	cout.tie(NULL);",
            "}",
            "",
            "signed main()",
            "{",
            "	sync();",
            "    return 0;",
            "}",
          ],
          description: "to produce the main snippet for cpp",
        },
      };

      fs.writeFileSync(
        `/home/powersaver/.config/Code/User/snippets/${article.title}.code-snippets`,
        JSON.stringify(content)
      );

      vscode.window.showInformationMessage("File Saved Successfully!!!");
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
