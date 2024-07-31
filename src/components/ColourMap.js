    const colorMap = {
    A: "bg-blue-400",
    B: "bg-red-400",
    C: "bg-purple-400",
    D: "bg-indigo-400",
    E: "bg-amber-400",
    F: "bg-yellow-400",
    G: "bg-lime-400",
    H: "bg-green-400",
    I: "bg-teal-400",
    J: "bg-cyan-400",
    K: "bg-blue-400",
    L: "bg-blue-500",
    M: "bg-indigo-500",
    N: "bg-purple-500",
    O: "bg-pink-400",
    P: "bg-red-500",
    Q: "bg-orange-400",
    R: "bg-amber-500",
    S: "bg-yellow-500",
    T: "bg-lime-500",
    U: "bg-green-500",
    V: "bg-teal-500",
    W: "bg-cyan-500",
    X: "bg-blue-500",
    Y: "bg-blue-600",
    Z: "bg-green-600"
  };
  export function generateColor(x) {
    if (colorMap.hasOwnProperty(x)) {
      return colorMap[x]
    }else{
      return "bg-blue-400";
    } 
  
}