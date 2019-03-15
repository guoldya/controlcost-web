/**
 * 给商品价格加补0
 * @param {*} value
 */
const keepTwoNum=function(value){
    if(value==undefined){
        return ""
    }
    var value=Math.round(parseFloat(value)*100)/100;
    var xsd=value.toString().split(".");
    if(xsd.length==1){
        value=value.toString()+".00";
        return value;
    }
    if(xsd.length>1){
        if(xsd[1].length<2){
            value=value.toString()+"0";
        }
        return value;
    }
};
const gender_if=function(value){
    if(!value){return;};
    if(value=="1"){
      return "男"
    }else if(value=="2"){
      return "女"
    }else{
      return "未知"
    }
};
//时间保留号数
const insHolderCls_if=function(value){
    if(!value){return;};
    if(value=="-1"){
      return "所有类型"
    }else if(value=="1"){
      return "医疗保险"
    }else if(value=="2"){
      return "工伤保险"
    }else if(value=="3"){
      return "生育保险"
    }else {
      return "未知"
    }
};
const handleResult_if=function(value){
    if(!value){return;};
    if(value=="2"){
      $(".color").css("color","#00A854");
      return "通过"
    }else if(value=="3"){
      $(".color").css("color","red");
      return "不通过"
    }
};
const date_time=function(ms){
    if(!ms){return;};
    let curTime = new Date(ms);
    let year = curTime.getFullYear();
    let month = curTime.getMonth() + 1;
    let day = curTime.getDate();
    let hours = curTime.getHours();
    let minutes = curTime.getMinutes();
    month = month <= 9 ? "0" + month : month;
    day = day <= 9 ? "0" + day : day;
    hours = hours <= 9 ? "0" + hours : hours;
    minutes = minutes <= 9 ? "0" + minutes : minutes;
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
};
const source_type=function(value){
  if(!value){return;};
  if (value == "1") {
    return "门诊"
  } else if (value == "2") {
    return "住院"
  } else if (value == "3") {
    return "全部"
  } else {
    return "未知"
  }
};
const status_type=function(value){
  // if(!value){return;};
  if (value == "0") {
    return "停用"
  } else if (value == "1") {
    return "启用"
  } else {
    return "未知"
  }
};
const control_type=function(value){
  if(!value){return;};
  if (value == "1") {
    return "警告"
  } else if (value == "2") {
    return "审核"
  } else if (value == "3") {
    return "禁止"
  } else {
    return "未知"
  }
};
const rightItemName=function(value){
  if(!value){return;};
  if (value == "1") {
    return "药品类"
  } else if (value == "2") {
    return "耗材类"
  } else if (value == "3") {
    return "诊疗类"
  } else {
    return ""
  }
};

export default {
    keepTwoNum,
  gender_if,
  insHolderCls_if,
  handleResult_if,
  date_time,
  source_type,
  rightItemName,
  control_type,
  status_type
}
