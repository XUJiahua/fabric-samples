const { callChainCode } = require("./cccore");
callChainCode(false, "invoke", "a", "b", "10")
  .then(() => {
    console.log("Issue program complete.");
  })
  .catch(e => {
    console.log("Issue program exception.");
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
  });

callChainCode(true, "query", "a")
  .then(() => {
    console.log("Issue program complete.");
  })
  .catch(e => {
    console.log("Issue program exception.");
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
  });
