import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

const rl = createInterface({
	input: stdin,
	output: stdout
});

const answer = await rl.question("=> Is it a good day or a bad$ day?");

console.log("=> Thank you for stating your opinion.");

rl.close();

