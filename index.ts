import formatter from "npm:@sqltools/formatter@1.2.5";

console.log(formatter.format("select * from users where id = 1", {
  language: "sql",
  reservedWordCase: "upper",
}));
