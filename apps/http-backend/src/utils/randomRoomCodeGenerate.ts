export function reandomeCodeGenerator(length : number) : string {
    const option = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    const optionLength = option.length;

    let ans = "";
    for(let i = 0; i < length; i++) {
        ans += option[Math.floor(Math.random() * optionLength)]
    }

    return ans;
    console.log("random rooom number : ", ans);
}