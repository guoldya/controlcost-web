const Enum = {
  yesNo: [
    {id: 0, text: '否' },
    {id: 1, text: '是' }
  ],
  sex:[
    {id:1,text:'男'},
    {id:2,text:'女'}
  ],
  status:[
    {id:0,text:'停用',badgeStatus:'error'},
    {id:1,text:'启用',badgeStatus:'success'},
  ],
  driverClassName:[
    {id:'org.postgresql.Driver',text:'org.postgresql.Driver'},
    {id:'oracle.jdbc.driver.OracleDriver',text:'oracle.jdbc.driver.OracleDriver'},
    {id:'com.mysql.jdbc.Driver',text:'com.mysql.jdbc.Driver'},
    {id:'com.microsoft.sqlserver.jdbc.SQLServerDriver',text:'com.microsoft.sqlserver.jdbc.SQLServerDriver'},
  ],
  refreshUnit:[
    {id:'毫秒',text:'毫秒'},
    {id:'秒',text:'秒'},
    {id:'小时',text:'小时'},
  ],
  factType:[
    {id:0,text:'系统函数'},
    {id:1,text:'数据库函数'},
  ],
  colType:[
    {id:1,text:'文本'},
    {id:2,text:'整型'},
    {id:3,text:'数字'},
    {id:4,text:'浮点'},
    {id:5,text:'时间'},
  ],
  specType:[
    {id:1,text:'药品组'},
    {id:2,text:'耗材组'},
    {id:3,text:'项目组'},
    // {id:4,text:'药品分类组'},
    // {id:5,text:'耗材分类组'},
    {id:4,text:'诊断组'},
  ],
  medItemType:[
    {id:1,text:'普通药品'},
    {id:2,text:'贵重'},
    {id:3,text:'精毒麻药品'},
    {id:4,text:'其他'},
  ],
  medInsFeeType:[
    {id:1,text:'甲类'},
    {id:2,text:'乙类'},
    {id:3,text:'自费'},
  ],
  medLlevel:[
    {id:1,text:'一线用药'},
    {id:2,text:'二线用药'},
  ],
  //医保病种类型
  dxInsType:[
    {id:1,text:'普通病'},
    {id:2,text:'特种病'},
    {id:3,text:'慢性病'},
    {id:4,text:'单病种'},
  ],
  //就诊类别
  dxVisCls:[
    {id:1,text:'普通'},
    {id:2,text:'医保'},
    {id:3,text:'全部'},
  ],
  //医保险种类别
  dxInsCls:[
    {id:-1,text:'所有类型'},
    {id:1,text:'医疗保险'},
    {id:2,text:'工伤保险'},
    {id:3,text:'生育保险'},
  ],
  //诊断使用来源
  dxScope:[
    {id:1,text:'门诊'},
    {id:2,text:'住院'},
    {id:0,text:'全部'},
  ],
  //指标类型
  itype: [
    {id:1,text:'全部'},
    {id:2,text:'门诊'},
    {id:3,text:'住院'},
  ],
  //科室类型
  deptDtype:[
    {id:1,text:'临床科室'},
    {id:2,text:'检查科室'},
    {id:3,text:'检验科室'},
    {id:4,text:'医疗保障科室'},
    {id:5,text:'行政科室'},
    {id:6,text:'其它科室'},
  ],
  deptSo:[
    {id:1,text:'门诊病人'},
    {id:2,text:'住院病人'},
    {id:3,text:'门诊和住院病人'},
    {id:4,text:'不服务于病人'},
  ],
//  违规处理审核状态
  violationAuditState:[
    {id:1,text:'未审核'},
    {id:2,text:'通过'},
    {id:3,text:'不通过'},
  ],
  newAuditStatus:[
    {id:1,text:'未审核'},
    // {id:2,text:'通过'},
    {id:3,text:'不通过'},
  ],
  handlingResult:[
    {id:2,text:'通过'},
    {id:3,text:'不通过'},
  ],
  itemType: [
    {id:1,text:'普通材料'},
    {id:2,text:'高值材料'},
    {id:3,text:'无菌材料'},
    {id:4,text:'其他'},
  ],
  hospitalLevel: [
    {id:1,text:'三级甲等'},
    {id:2,text:'三级乙等'},
    {id:3,text:'二级甲等'},
    {id:4,text:'二级乙等'},
    {id:5,text:'二级丙等'},
    {id:6,text:'一级'},
  ],
  hospitalCls: [
    {id:1,text:'综合医院'},
    {id:2,text:'妇幼保健院'},
    {id:3,text:'社区卫生服务中心'},
    {id:4,text:'中心卫生院'},
    {id:5,text:'疗养院'},
    {id:6,text:'综合门诊部'},
    {id:7,text:'诊所'},
    {id:8,text:'村卫生室（所）'},
    {id:9,text:'急救中心'},
    {id:10,text:'临床检验中心'},
    {id:11,text:'专科疾病防治院'},
    {id:12,text:'护理院'},
    {id:13,text:'其他诊疗机构'},
  ],
  sysDataType: [
    {id:1,text:'TEXT文本'},
    {id:2,text:'NUM数值'},
    {id:3,text:'INT整型'},
    {id:4,text:'Date日期'},
    {id:5,text:'DateTime日期时间'},
    {id:6,text:'ComboBox选项'},
    {id:7,text:'Boolean布尔值'},
  ],
  paramsScope: [
    {id:0,text:'系统参数'},
  ],
  controlRule: [
    {id:1,text:'警告'},
    {id:2,text:'审核'},
    {id:3,text:'禁止'},
  ],
  controlState:[
    {id:1,text:'警告'},
    {id:2,text:'审核'},
    {id:3,text:'禁止'},
  ],
  //查询规则
  queryRules: [
    {id:1,text:'按年计划量'},
    {id:2,text:'按月计划量'},
    {id:3,text:'按日计划量'},
    {id:4,text:'按自定义时间'},
  ],

  //交易代码
  tcode: [
    {id:1,text:'门诊挂号'},
    {id:2,text:'门诊医嘱'},
    {id:3,text:'门诊结算'},
    {id:4,text:'住院登记'},
    {id:5,text:'住院医嘱'},
    {id:6,text:'住院结算'},
  ],
  //引擎限定类型
  subType: [
    //{text: ''},
    {id:-1,text:'药品'},
    {id:-2,text:'耗材'},
    {id:-3,text:'项目'},
    {id:-4,text:'诊断'},
    {id:1,text:'药品组'},
    {id:2,text:'耗材组'},
    {id:3,text:'项目组'},
    {id:4,text:'诊断组'},
  ],

  //格式化类型
  cfType:[
    {id:1,text:'POJO 函数格式化'},
    {id:2,text:'数据库函数格式化'},
  ],
//  断言值类型
  assertType:[
    {id:1,text:'常量'},
    {id:2,text:'外部数据库'},
    {id:3,text:'数值区间'},
],
  planType:[
    {id:1,text:'药品类'},
    {id:2,text:'耗材类'},
    {id:3,text:'诊疗类'},
    ],
  peopleType:[
    {id:1,text:'科室'},
    {id:2,text:'医生'},
  ],
  singleType:[
    {id:1,text:'单病种全部'},
    {id:2,text:'单病种超额'},
  ],

  packageType:[
    {id:0,text:'导入'},
    {id:1,text:'新建'},
  ],
  queryDataState:[
    {id:1,text:'正常'},
    {id:2,text:'撤销'},
  ],
  roleType: [
    {id:1,text:'院长'},
    {id:2,text:'科室主任'},
    {id:3,text:'医生'},
    {id:4,text:'医保科'},
  ],
  calculate: [
    {id:1,text:'相等'},
    {id:2,text:'不相等'},
    {id:3,text:'大于'},
    {id:4,text:'小于'}
  ],
  orderCodeList:[
    {id:0,text:""},
    {id:1,text:"药品"},
    {id:2,text:"治疗"},
    {id:3,text:"手术"},
    {id:4,text:"膳食"},
    {id:5,text:"输血"},
    {id:6,text:"护理"},
    {id:7,text:"检查"},
    {id:8,text:"检验"},
    {id:9,text:"输液"},
    {id:10,text:"材料"},
    {id:11,text:"停止医嘱"},
    {id:12,text:"转科"},
    {id:13,text:"出院"},
    {id:14,text:"出院带药"},
  ],
  natureWork:[
    {id:1,text:"医生"},
    {id:2,text:"收费、结账人员"},
    {id:3,text:"护士"},
    {id:4,text:"药房、药库人员"},
    {id:5,text:"医技人员"},
    {id:6,text:"行政人员"},
    {id:7,text:"其它人员"},
  ],
};
export default Enum;
