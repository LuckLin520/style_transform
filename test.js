function testObject2CssText() {
  const cssObj = {
    width: 200,
    lineHeight: 2,
    fontSize: 10,
    borderRadius: 5,
    background: "pink",
    "&:hover": {
      background: "red",
      textAlign: "center",
      ".children": {
        color: "orange",
        paddingLeft: 20,
      },
    },
  };
  console.log(CssObjectTransfer.object2CssText(cssObj));
}
function testCssText2Object() {
  const str = `
    width:200px;
    line-height:2;
    font-size:10px;
    border-radius:5px;
    background:pink;
    &:hover{
      background:red;
      text-align: center;
      .children{
        color:orange;
        padding-left: 20px;
      }
    }
  `;
  console.log(CssObjectTransfer.cssText2Object(str, true));
}
