let input=
`###400710000
###060000030
###000200508
000030###000
702000###060
600080###400
007###020004
030###000805
000###060000
408007000###
070000050###
000045008###`;
input=
`530070000
600195000
098000060
800060003
400803001
700020006
060000280
000419005
000080079`;
let zeroType="000000000".split("");
zeroType.forEach((str,ind,arr)=>{arr[ind]=Number(str);});
let all=input.split("\n");
all.forEach((str,index,arr)=>{
  arr[index]=str.split("");
});
for(let i=0;i<all.length;i++){
  for(let j=0;j<all[i].length;j++){
      let index=all[i][j];
      if(index==="#")all[i][j]="000000000".split("");
      else if(index==="0")all[i][j]="111111111".split("");
      else{
        all[i][j]="000000000".split("");
        all[i][j][Number(index)-1]="1";
      }
      all[i][j].forEach((str,ind,arr)=>{
        arr[ind]=Number(str);
      });
  }
}
//到此為止，每一格都是陣列，每項代表該數字可能性
//pall可以刷一遍，讓狀態回歸，但仍無法尋找行列格內唯一數字
function main(){
  console.log("掃除"+pall()+"格");
  while(1){
    let count=0
    count=qall();
    console.log("補齊"+count+"格");
    if(count===0)break;
  }
  console.log(" "+out().split("").join(" "));
}
main();


function qall(){
  let count=0;
  for(let i=0;i<all.length;i++)count+=dc(i);
  for(let i=0;i<all[0].length;i++)count+=dr(i);
  for(let i=0;i<all.length/3;i++){
    for(let j=0;j<all[0].length/3;j++)count+=db(i,j);
  }
  return count;
}
function pall(){
  let count=0;
  for(let i=0;i<all.length;i++){
    for(let j=0;j<all[i].length;j++){
      let rr=0;
      all[i][j].forEach((p)=>{
        rr+=p;
      });
      if(rr===1)count+=pp(i,j);
    }
  }
  return count;
}
function out(){
  let result="";
  for(let i=0;i<all.length;i++){
    for(let j=0;j<all[i].length;j++){
      let rr=0;
      all[i][j].forEach((p)=>{
        rr+=p;
      });
      if(rr===1){
        result+=(all[i][j].indexOf(1)+1).toString();
      }
      else if(rr===0)result+="#";
      else result+="0";
    }
    result+="\n";
  }
  return result;
}
function dr(a){//每一列中，於直行a的物件，若某數字只出現一次，消除其餘
  let count=0;
  let numbers=[];
  for(let i=0;i<9;i++){
    numbers.push({count:0,index:-1});
  }
  for(let i=0;i<all.length;i++){
    all[i][a].forEach((num,index)=>{
      if(num===1){
        numbers[index].count++;
        numbers[index].index=i;
       }
    });
  }
  numbers.forEach((obj,index)=>{
    if(obj.count===1){
      all[obj.index][a]=[...zeroType];
      all[obj.index][a][index]=1;
      count+=pp(obj.index,a);
    }
  });
  return count;
}
function dc(a){//單行d
  let count=0;
  let numbers=[];
  for(let i=0;i<9;i++){
    numbers.push({count:0,index:-1});
  }
  for(let i=0;i<all[a].length;i++){
    all[a][i].forEach((num,index)=>{
      if(num===1){
        numbers[index].count++;
        numbers[index].index=i;
      }
    });
  }
  numbers.forEach((obj,index)=>{
    if(obj.count===1){
      all[a][obj.index]=[...zeroType];
      all[a][obj.index][index]=1;
      count+=pp(a,obj.index);
    }
  });
  return count;
}
function db(bi,bj){
  let count=0;
  let numbers=[];
  for(let i=0;i<9;i++){
    numbers.push({count:0,index:[-1,-1]});
  }
  for(let i=3*bi;i<3*(bi+1);i++){
    for(let j=3*bj;j<3*(bj+1);j++){
      all[i][j].forEach((num,index)=>{
        if(num===1){
          numbers[index].count++;
          numbers[index].index=[i,j];
        }
      });
    }
  }
  numbers.forEach((obj,nb)=>{
    if(obj.count===1){
      all[obj.index[0]][obj.index[1]]=[...zeroType];
      all[obj.index[0]][obj.index[1]][nb]=1;
      count+=pp(obj.index[0],obj.index[1]);
    }
  });
  return count;
}
function pp(i,j){
  let count=0;
  count+=pr(i,j);
  count+=pc(i,j);
  count+=pb(i,j);
  return count;
}
function pr(a,b){
  let count=0;
  let num=all[a][b].indexOf(1);
  for(let i=0;i<all.length;i++){
    if(i!==a)count+=due(i,b,num);
  }
  return count;
}
function pc(a,b){
  let count=0;
  let num=all[a][b].indexOf(1);
  for(let j=0;j<all[a].length;j++){
    if(j!==b)count+=due(a,j,num);
  }
  return count;
}
function pb(a,b){
  let count=0;
  let num=all[a][b].indexOf(1);
  let i0=a-a%3;
  let j0=b-b%3;
  for(let i=i0;i<i0+3;i++){
    for(let j=j0;j<j0+3;j++){
     if(i!==a&&j!==b)count+=due(i,j,num);
    }
  }
  return count;
}
function due(i,j,k){
  if(all[i][j][k]!==0){
    all[i][j][k]=0;
    return 1;
  }
  return 0;
}