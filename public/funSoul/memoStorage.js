class NewMemo{
  content = "";
  embedding = [];
  mood = [];
  importance = 0;
  constructor() {
    //this.content = "";
    //this.embedding = [];
    //this.mood = [];
    //this.importance = 0; 
  }

  assignMood(stringPosition){
    this.mood = stringPosition.split(',').map(Number);
  }
}
// class Memo {
//   content = "";  
//   lifes = 0;    
//   position = [];  

//   Memo(){

//   }
//   // 赋值函数
//   assignValues(longString) {
//     // 通过双空格分割长字符串
//     const parts = longString.split("  ");
    
//     // 检查分割后的部分数量是否正确
//     if (parts.length !== 3) {
//       console.error("输入的字符串格式不正确，需要恰好两个双空格分隔符。");
//       return;
//     }

//     // 赋值给成员变量
//     this.content = parts[0];
//     this.lifes = Number(parts[1]);  // 将字符串转换为数字
//     let stringPosition = parts[2];

//     this.position = stringPosition.split(',').map(Number);

//     // 检查数字是否有效
//     if (isNaN(this.lifes)) {
//       console.error("字符串中的数字部分无法转换为有效数字。");
//       this.lifse = 0;  // 重置数字为0
//     }
//   }

// }

// // let tempTarget = new Memo();
// // tempTarget.assignValues("abc  99  2,2");
// // let temps = [new Memo(), new Memo(), new Memo()];
// // temps[0].assignValues("a  9  1,2");
// // temps[1].assignValues("b  9  2,3");
// // temps[2].assignValues("c  99  2,2");

// function setUpClustering(clusterPoints){
//   // 提取聚类坐标点数组
//   let pointsForClustering = clusterPoints.map(p => p.position);

//   // 进行DBSCAN聚类
//   let clusters = dbscan(pointsForClustering, 1.5 /* 半径 */, 2 /* 最小点数 */);
//   console.log(clusters);
//   return clusters;
// }



// // 查找给定点所在的聚类并返回该聚类中的其他点
// //targetPoint == Memo类型
// //clusterPoints == memories
// //cluster是setUpClustering中给出的
// function findClusterForPoint(targetPoint, clusterPoints, clusters) {
//     let targetIndex = clusterPoints.findIndex(p => p.position[0] === targetPoint.position[0] && p.position[1] === targetPoint.position[1]);
//     let targetClusterIndex = clusters.findIndex(cluster => cluster.includes(targetIndex));

//     if (targetClusterIndex === -1) return []; // 如果点不在任何聚类中，则返回空数组

//     // 返回聚类中的其他点（排除给定点）
//     return clusters[targetClusterIndex].filter(index => index !== targetIndex);
// }

// function fetchMemory(targetPoint, clusterPoints){
//   //console.log(setUpClustering(clusterPoints));
//   let clusterIndex = findClusterForPoint(targetPoint, clusterPoints, setUpClustering(clusterPoints));
//   //console.log(`目标点 ${targetPoint.position} 所在聚类的其他点:`, clusterIndex);
//   let clusterPointsInstances = clusterIndex.map(index => clusterPoints[index]);
//   let combinedContent = clusterPointsInstances.map(p => p.content).join("; ");
//   return combinedContent;
// }

// //console.log(fetchMemory(tempTarget, temps));

// //算法
// function dbscan(data, eps, minPts) {
//   let clusters = [];
//   let visited = new Set();
//   let noise = new Set();

//   function isCorePoint(pointIdx) {
//     return regionQuery(pointIdx).length >= minPts;
//   }

//   function regionQuery(pointIdx) {
//     let neighbors = [];
//     for (let i = 0; i < data.length; i++) {
//       let dist = euclideanDist(data[pointIdx], data[i]);
//       if (dist <= eps) {
//         neighbors.push(i);
//       }
//     }
//     return neighbors;
//   }

//   function expandCluster(pointIdx, neighbors, clusterIdx) {
//     clusters[clusterIdx].push(pointIdx);
//     visited.add(pointIdx);

//     for (let i = 0; i < neighbors.length; i++) {
//       let currIdx = neighbors[i];
//       if (!visited.has(currIdx)) {
//         visited.add(currIdx);
//         let currNeighbors = regionQuery(currIdx);
//         if (currNeighbors.length >= minPts) {
//           neighbors = neighbors.concat(currNeighbors.filter(n => !neighbors.includes(n)));
//         }
//         if (!clusters.some(cluster => cluster.includes(currIdx))) {
//           clusters[clusterIdx].push(currIdx);
//         }
//       }
//     }
//   }

//   for (let i = 0; i < data.length; i++) {
//     if (!visited.has(i)) {
//       visited.add(i);
//       let neighbors = regionQuery(i);
//       if (isCorePoint(i)) {
//         let clusterIdx = clusters.length;
//         clusters.push([]);
//         expandCluster(i, neighbors, clusterIdx);
//       } else {
//         noise.add(i);
//       }
//     }
//   }

//   return clusters;
// }

// function euclideanDist(p1, p2) {
//   return Math.sqrt(p1.reduce((sum, value, index) => sum + Math.pow(value - p2[index], 2), 0));
// }





