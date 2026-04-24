const HIGH_FREQ_IDS = [
  'ask-payment','long-stay','underpay','overpay',
  'minor-cigarette','pos-breakdown','merchant-code','door-not-open'
];

const KB_DATA = {
  version: '7.0',
  lastUpdate: '2026-04-24',
  modules: [
    {
      id: 'ai-watching',
      name: 'AI 值守专区',
      icon: '🤖',
      color: 'primary',
      desc: 'AI 值守岗位专用：远程监控、实时响应、异常处理',
      categories: [
        {
          id: 'ai-risk',
          name: '异常与风险',
          icon: '🚨',
          desc: '偷盗识别、风险预警、身份核实',
          scenarios: [
            {id:'theft-instore',title:'店内小型偷盗',risk:'high',tags:['偷盗','资金安全'],keywords:['偷','盗','藏商品','夹带'],criteria:'发现偷盗行为',flow:[{role:'客服',step:'按L键强制锁门'},{role:'客服',step:'复制店铺信息'},{role:'客服',step:'备注详情'},{role:'客服',step:'转交二线'},{role:'值班店长',step:'上报班长'}],scripts:[],transferCondition:'立即转二线+上报班长',notes:'高风险必须上报班长',needReport:true},
            {id:'theft-door',title:'倚门盗抢',risk:'high',tags:['盗抢','人身安全'],keywords:['抢','门口','盗抢','强抢'],criteria:'门口发生盗抢',flow:[{role:'客服',step:'复制店铺信息'},{role:'客服',step:'备注详情'},{role:'客服',step:'转交二线'},{role:'值班店长',step:'上报班长'}],scripts:[],transferCondition:'立即转二线+上报班长',notes:'倚门盗抢不锁门，避免冲突',needReport:true},
            {id:'underpay',title:'少付/漏付',risk:'high',tags:['资金风险'],keywords:['少付','漏付','没付全'],criteria:'实际支付少于应付',flow:[{step:'按L键锁门'},{step:'转交二线处理'}],scripts:[],transferCondition:'立即转二线+锁门',notes:'高风险必须锁门',needReport:true},
            {id:'merchant-code',title:'扫描商家收款码',risk:'mid',tags:['私码'],keywords:['商家码','老板码','私人码'],criteria:'顾客扫了商家私人码',flow:[{step:'引导在POS机重新支付'},{step:'顾客拒绝则上报班长'}],scripts:[{label:'引导',text:'辛苦您在POS机上重新支付，不然门无法打开，多付款项我们会联系商家退还。'}],transferCondition:'顾客拒绝则上报',notes:'',needReport:true},
            {id:'minor-cigarette',title:'未成年购买香烟',risk:'high',tags:['特殊人群','合规'],keywords:['未成年','学生','买烟'],criteria:'疑似未成年购烟',flow:[{step:'主动介入询问年龄'},{step:'要求出示身份证'},{step:'未满18岁拒绝售卖'}],scripts:[{label:'询问',text:'您好，购买香烟需要年满18周岁，请问您满18岁了吗？请出示您的身份证。'}],transferCondition:'顾客拒不配合转二线',notes:'',identifyTips:['穿校服','背书包','身高矮小','面部稚嫩'],needReport:false},
            {id:'uniform-person',title:'制服人员进店',risk:'high',tags:['特殊人群','执法'],keywords:['制服','执法','检查','工商'],criteria:'制服人员进店',flow:[{step:'主动询问来意'},{step:'公务检查立即转二线+备注'}],scripts:[{label:'询问',text:'请问您是来购物还是有其他事项？'}],transferCondition:'公务检查立即转二线',notes:'',needReport:false},
            {id:'drunk-customer',title:'顾客醉酒闹事',risk:'high',tags:['特殊人群','安全'],keywords:['醉酒','喝醉','闹事'],criteria:'顾客醉酒',flow:[{step:'备注情况'},{step:'转接二线'}],scripts:[],transferCondition:'立即转二线',notes:'',needReport:false},
            {id:'food-expired',title:'商品过期/变质投诉',risk:'high',tags:['食品安全'],keywords:['过期','变质','发霉'],criteria:'顾客投诉食品问题',flow:[{step:'优先安抚'},{step:'引导将商品放显眼位置'},{step:'上报班长联系商家'}],scripts:[{label:'安抚',text:'实在抱歉，辛苦您将商品放在收银台上，我们马上通知商家处理。'}],transferCondition:'上报班长',notes:'',needReport:true}
          ]
        },
        {
          id: 'ai-behavior',
          name: '顾客行为干预',
          icon: '👥',
          desc: '不当行为制止、滞留处理、特殊情况应对',
          scenarios: [
            {id:'smoking',title:'顾客在店内吸烟',risk:'mid',tags:['主动服务','安全','禁止行为'],keywords:['吸烟','抽烟','点烟','打火机'],criteria:'发现顾客在店内吸烟',flow:[{step:'立即介入制止'},{step:'使用标准话术提醒'}],scripts:[{label:'制止话术',text:'本店禁止吸烟，请您将香烟熄灭至店外，感谢您的配合。'}],transferCondition:'顾客拒不配合则转二线',notes:'',identifyTips:['顾客手持香烟','闻到烟味','看到烟雾'],needReport:false},
            {id:'long-stay',title:'顾客长时间在店',risk:'low',tags:['主动服务','滞留'],keywords:['长时间','一直在','不走','滞留','待很久'],criteria:'顾客在店超过正常购物时间',flow:[{role:'客服',step:'主动询问顾客诉求'},{role:'客服',step:'根据回复进行相应处理'}],scripts:[{label:'询问话术',text:'请问有什么可以帮到您的？'}],transferCondition:'顾客有特殊需求则转二线',notes:'',needReport:false},
            {id:'child-pet',title:'顾客携带儿童/宠物进店',risk:'low',tags:['主动服务','安全'],keywords:['小孩','儿童','宠物','狗','猫','宝宝'],criteria:'发现儿童或宠物进店',flow:[{step:'及时介入提醒'}],scripts:[{label:'儿童提醒',text:'请您看顾好您的小朋友，避免磕伤碰伤。'},{label:'宠物提醒',text:'本店禁止宠物入内，请将宠物带离至店外。'}],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        },
        {
          id: 'ai-transfer',
          name: '转交规范',
          icon: '🔄',
          desc: 'AI值守转交二线的判断标准与操作规范',
          scenarios: [
            {id:'transfer-full',title:'完全转交',risk:'low',tags:['转交','流程'],keywords:['完全转交','全部转交'],criteria:'AI无法处理需完全转交',flow:[{step:'判断是否属于完全转交场景'},{step:'复制店铺信息'},{step:'详细备注情况'},{step:'点击转交二线按钮'}],scripts:[],transferCondition:'AI完全无法处理的场景',notes:'包括：商家主动求助、设备故障、复杂纠纷等',needReport:false},
            {id:'transfer-partial',title:'部分转交',risk:'low',tags:['转交','流程'],keywords:['部分转交','协助处理'],criteria:'AI处理后仍需二线介入',flow:[{step:'AI先行处理基础问题'},{step:'记录已处理内容'},{step:'备注需二线协助的具体事项'},{step:'转交二线'}],scripts:[],transferCondition:'AI已处理部分，剩余需人工',notes:'如：AI已引导支付，但顾客仍有疑问需解释',needReport:false},
            {id:'transfer-direct',title:'直接转交',risk:'low',tags:['转交','流程'],keywords:['直接转交','立即转交'],criteria:'高风险场景需立即转交',flow:[{step:'识别高风险场景'},{step:'立即锁门（如需要）'},{step:'快速备注关键信息'},{step:'立即转交二线'}],scripts:[],transferCondition:'偷盗、少付、人身安全等高风险',notes:'争分夺秒，先转交再补充详情',needReport:true}
          ]
        }
      ]
    },
    {
      id: 'duty-manager',
      name: '值班店长专区',
      icon: '👔',
      color: 'warning',
      desc: '值班店长专用：场景处理、顾客纠纷、特殊商品管理',
      categories: [
        {
          id: 'dm-payment',
          name: '支付与结算',
          icon: '💳',
          desc: '多付、少付、支付异常、退款处理',
          scenarios: [
            {id:'overpay',title:'顾客多付款',risk:'mid',tags:['支付','退款'],keywords:['多付','多扣','付多了','退钱'],criteria:'顾客实际支付超过商品金额',flow:[{step:'核实支付记录'},{step:'联系商家确认退款'},{step:'告知顾客退款时效'}],scripts:[{label:'安抚',text:'您好，我们已核实您的支付情况，会联系商家在1-3个工作日内退还多付金额，请您放心。'}],transferCondition:'商家不配合退款则上报班长',notes:'',needReport:false},
            {id:'ask-payment',title:'顾客询问支付方式',risk:'low',tags:['支付','引导'],keywords:['怎么付','如何支付','付款方式','扫码'],criteria:'顾客不知道如何支付',flow:[{step:'引导顾客扫描POS机二维码'},{step:'确认支付成功后开门'}],scripts:[{label:'引导',text:'您好，请扫描收银台上的二维码进行支付，支付成功后门会自动打开。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'pos-breakdown',title:'POS机故障',risk:'high',tags:['设备','支付'],keywords:['POS坏了','收银机','刷卡机','不能付款'],criteria:'POS机无法正常使用',flow:[{step:'引导顾客使用备用支付方式'},{step:'备注故障情况'},{step:'通知商家处理设备'}],scripts:[{label:'引导',text:'非常抱歉，收银设备暂时出现故障，请您使用手机扫码支付，给您带来不便深表歉意。'}],transferCondition:'无法解决立即转二线',notes:'',needReport:true},
            {id:'refund-request',title:'顾客要求退款',risk:'mid',tags:['退款','售后'],keywords:['退款','退钱','不想要了'],criteria:'顾客购买后要求退款',flow:[{step:'了解退款原因'},{step:'核实购买记录'},{step:'联系商家处理'}],scripts:[{label:'受理',text:'您好，请问您需要退款的原因是什么？我们会帮您联系商家处理。'}],transferCondition:'商家拒绝退款则上报班长',notes:'',needReport:false}
          ]
        },
        {
          id: 'dm-special',
          name: '特殊商品管理',
          icon: '🚬',
          desc: '香烟、酒类、处方药等特殊商品的销售管控',
          scenarios: [
            {id:'alcohol-minor',title:'未成年购买酒类',risk:'high',tags:['特殊人群','合规'],keywords:['未成年','学生','买酒'],criteria:'疑似未成年购买酒类',flow:[{step:'主动介入询问年龄'},{step:'要求出示身份证'},{step:'未满18岁拒绝售卖'}],scripts:[{label:'询问',text:'您好，购买酒类需��年满18周岁，请问您满18岁了吗？请出示您的身份证。'}],transferCondition:'顾客拒不配合转二线',notes:'',identifyTips:['穿校服','背书包','身高矮小','面部稚嫩'],needReport:false},
            {id:'prescription-drug',title:'购买处方药',risk:'high',tags:['合规','处方药'],keywords:['处方药','需要处方','开方'],criteria:'顾客购买需处方的药品',flow:[{step:'询问是否有处方'},{step:'无处方拒绝售卖'},{step:'引导去医院开具处方'}],scripts:[{label:'拒绝',text:'您好，该药品属于处方药，需要凭医生处方才能购买，请您前往医院就诊后凭处方购买。'}],transferCondition:'顾客坚持购买转二线',notes:'',needReport:false},
            {id:'no-barcode',title:'无条码商品',risk:'mid',tags:['商品','结算'],keywords:['没有条码','扫不出来','无码'],criteria:'商品无法扫码结算',flow:[{step:'引导顾客在购物车手动添加'},{step:'联系商家确认价格'},{step:'协助完成结算'}],scripts:[{label:'引导',text:'您好，该商品暂时无法扫码，请您在购物车中手动搜索添加，或联系我们协助处理。'}],transferCondition:'无法处理转二线',notes:'',needReport:false}
          ]
        },
        {
          id: 'dm-dispute',
          name: '顾客纠纷处理',
          icon: '⚖️',
          desc: '投诉、纠纷、顾客不满的处理流程',
          scenarios: [
            {id:'customer-complaint',title:'顾客投诉服务',risk:'mid',tags:['投诉','服务'],keywords:['投诉','不满意','服务差','要投诉'],criteria:'顾客对服务不满意',flow:[{step:'耐心倾听顾客诉求'},{step:'表达歉意'},{step:'提出解决方案'},{step:'必要时上报班长'}],scripts:[{label:'受理',text:'非常抱歉给您带来不好的体验，请您告诉我具体情况，我们会尽力为您解决。'}],transferCondition:'无法解决上报班长',notes:'',needReport:false},
            {id:'door-not-open',title:'门无法打开',risk:'high',tags:['设备','门禁'],keywords:['门打不开','出不去','进不来','门坏了'],criteria:'门禁系统异常无法开关门',flow:[{step:'核实支付状态'},{step:'远程尝试开门'},{step:'通知商家或维修'},{step:'安抚顾客等待'}],scripts:[{label:'安抚',text:'非常抱歉，门禁系统出现异常，我们正在紧急处理，请您稍等片刻，感谢您的耐心等待。'}],transferCondition:'立即转二线处理',notes:'',needReport:true},
            {id:'price-dispute',title:'商品价格争议',risk:'mid',tags:['价格','纠纷'],keywords:['价格不对','标价','贵了','价格错误'],criteria:'顾客对商品价格有异议',flow:[{step:'核实商品实际价格'},{step:'联系商家确认'},{step:'按实际价格处理'}],scripts:[{label:'核实',text:'您好，我来帮您核实一下该商品的价格，请稍等。'}],transferCondition:'价格差异较大联系商家',notes:'',needReport:false}
          ]
        }
      ]
    },
    {
      id: 'scenarios',
      name: '具体场景',
      icon: '📋',
      color: 'info',
      desc: '280+真实场景库：偷盗、身份核实、设备、商品、顾客行为、安全风险',
      categories: [
        {
          id: 'sc-theft',
          name: '偷盗相关',
          icon: '🚨',
          desc: '现场盗抢、计价舞弊、风险预警',
          scenarios: [
            {id:'sc-theft-direct',title:'非正常方式进店偷盗',risk:'high',tags:['偷盗'],keywords:['翻墙','破门','非正常进店'],criteria:'顾客通过非正常方式进店后偷盗',flow:[{step:'立即锁门'},{step:'复制店铺信息备注'},{step:'转交二线+上报班长'}],scripts:[],transferCondition:'立即转二线+上报班长',notes:'无进出记录需特别备注',needReport:true},
            {id:'sc-theft-door2',title:'倚门偷盗',risk:'high',tags:['偷盗'],keywords:['门口偷','倚门'],criteria:'顾客在门口实施偷盗',flow:[{step:'不锁门避免冲突'},{step:'备注详情'},{step:'转交二线+上报班长'}],scripts:[],transferCondition:'立即转二线+上报班长',notes:'倚门偷盗不锁门',needReport:true},
            {id:'sc-theft-goods',title:'顾客故意偷盗商品',risk:'high',tags:['偷盗'],keywords:['藏商品','夹带','偷拿'],criteria:'发现顾客藏匿商品',flow:[{step:'按L键锁门'},{step:'备注详情'},{step:'转交二线'}],scripts:[],transferCondition:'立即转二线',notes:'',needReport:true},
            {id:'sc-underpay2',title:'故意少付漏付',risk:'high',tags:['资金风险'],keywords:['���付','漏付'],criteria:'顾客故意少付或漏付',flow:[{step:'按L键锁门'},{step:'转交二线处理'}],scripts:[],transferCondition:'立即转二线+锁门',notes:'',needReport:true},
            {id:'sc-barcode-swap',title:'撕换条码差价',risk:'high',tags:['计价舞弊'],keywords:['换条码','撕标签','改价格'],criteria:'发现顾客撕掉或更换商品条码',flow:[{step:'立即介入制止'},{step:'要求按原价支付'},{step:'拒绝则锁门转二线'}],scripts:[{label:'制止',text:'您好，请按商品原价支付，谢谢配合。'}],transferCondition:'拒绝配合立即转二线',notes:'',needReport:true},
            {id:'sc-theft-suspect',title:'疑似偷盗行为异常',risk:'mid',tags:['风险预警'],keywords:['行为异常','遮挡摄像头'],criteria:'顾客行为高度异常疑似偷盗',flow:[{step:'重点关注监控'},{step:'主动介入询问'},{step:'无法核实转二线'}],scripts:[{label:'询问',text:'您好，请问有什么需要帮助的吗？'}],transferCondition:'无法核实转二线',notes:'',needReport:false}
          ]
        },
        {
          id: 'sc-identity',
          name: '身份与核实',
          icon: '🪪',
          desc: '人员身份核实、骑手、店主家人、潜在风险人员',
          scenarios: [
            {id:'sc-rider',title:'外卖骑手取货',risk:'low',tags:['骑手','核实'],keywords:['骑手','外卖','取货','美团'],criteria:'外卖骑手进店取货',flow:[{step:'核实订单信息'},{step:'引导正确取货'},{step:'确认核销后开门'}],scripts:[{label:'引导',text:'您好，请出示您的取货订单，核实后为您开门。'}],transferCondition:'订单异常转二线',notes:'',needReport:false},
            {id:'sc-owner-family',title:'店主家人/朋友进店',risk:'mid',tags:['身份核实'],keywords:['老板家人','老板朋友','老板让我来'],criteria:'自称店主家人或朋友进店拿货',flow:[{step:'联系商家核实身份'},{step:'商家确认后方可放行'},{step:'未确认不得拿货'}],scripts:[{label:'核实',text:'您好，为保障商家财产安全，需要联系商家确认您的身份，请稍等。'}],transferCondition:'联系不上商家转二线',notes:'',needReport:false},
            {id:'sc-worker',title:'业务员/送货员进店',risk:'low',tags:['身份核实'],keywords:['送货','补货','理货','业务员'],criteria:'业务人员进店补货或理货',flow:[{step:'询问来意'},{step:'全程关注监控'},{step:'特殊情况告知商家'}],scripts:[{label:'询问',text:'您好，请问您是来送货还是补货的？'}],transferCondition:'异常情况转二线',notes:'',needReport:false},
            {id:'sc-already-instore',title:'分配时顾客已在店',risk:'mid',tags:['身份核实'],keywords:['已���在店里','顾客在里面'],criteria:'接手店铺时已有顾客在店内',flow:[{step:'主动介入询问顾客情况'},{step:'核实是否已完成支付'},{step:'未付款引导支付'}],scripts:[{label:'询问',text:'您好，请问您是否已完成支付？'}],transferCondition:'无法核实转二线',notes:'',needReport:false},
            {id:'sc-risk-person',title:'重点关注人员进店',risk:'high',tags:['风险预警','身份核实'],keywords:['黑名单','重点关注'],criteria:'系统标记的重点关注人员进店',flow:[{step:'立即提高警惕'},{step:'全程密切监控'},{step:'异常立即转二线'}],scripts:[],transferCondition:'发现异常立即转二线',notes:'',needReport:true},
            {id:'sc-no-record',title:'无进店记录要求拿货',risk:'high',tags:['风险预警'],keywords:['没有记录','没进店'],criteria:'无进店记录顾客要求拿货',flow:[{step:'拒绝直接放行'},{step:'联系商家核实'},{step:'无法核实转二线'}],scripts:[{label:'拒绝',text:'您好，系统显示无您的进店记录，需要联系商家核实才能放行，请稍等。'}],transferCondition:'无法核实转二线',notes:'',needReport:true}
          ]
        },
        {
          id: 'sc-device',
          name: '设备技术类',
          icon: '⚙️',
          desc: '工作台客服相关、店铺设备故障',
          scenarios: [
            {id:'sc-door-stuck',title:'门无法正常开关',risk:'high',tags:['门禁','设备'],keywords:['门打不开','门卡住','门坏'],criteria:'门禁无法正常工作',flow:[{step:'核实支付状态'},{step:'远程尝试操控'},{step:'通知商家维修'}],scripts:[{label:'安抚',text:'非常抱歉，我们正在紧急处理门禁问题，请稍等。'}],transferCondition:'立即转二线',notes:'',needReport:true},
            {id:'sc-camera-offline',title:'监控摄像头离线',risk:'high',tags:['设备','监控'],keywords:['摄像头','监控断了','看不见'],criteria:'店铺监控摄像头离线',flow:[{step:'备注摄像头离线情况'},{step:'通知商家检查设备'},{step:'上报班长'}],scripts:[],transferCondition:'上报班长+通知商家',notes:'',needReport:true},
            {id:'sc-pos-issue',title:'POS收银机异常',risk:'mid',tags:['设备','支付'],keywords:['收银机','POS','付不了'],criteria:'POS收银机无法正常使用',flow:[{step:'引导使用其他支付方式'},{step:'备注故障情况'},{step:'通知商家'}],scripts:[{label:'引导',text:'非常抱歉，收银设备暂时异常，请您使用扫码支付，感谢理解。'}],transferCondition:'无法解决转二线',notes:'',needReport:true}
          ]
        },
        {
          id: 'sc-goods2',
          name: '商品服务类',
          icon: '🛒',
          desc: '支付结算、售后退换、商品破坏、商家需求',
          scenarios: [
            {id:'sc-pay-method',title:'顾客询问如何支付',risk:'low',tags:['支付','引导'],keywords:['怎么付','如何支付'],criteria:'顾客不会使用支付系统',flow:[{step:'引导扫码支付'},{step:'确认支付成功'}],scripts:[{label:'引导',text:'您好，请扫描收银台上的二维码进行支付，支付成功后门会自动打开。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'sc-price-equal',title:'等价/差价置换商品',risk:'mid',tags:['商品','计价'],keywords:['等价换','差价换'],criteria:'顾客要求等价置换商品',flow:[{step:'核实商家是否允许等价置换'},{step:'按商家要求处理'}],scripts:[],transferCondition:'商家明确禁止则拒绝',notes:'',needReport:false},
            {id:'sc-return',title:'顾客要求退换货',risk:'mid',tags:['售后','退换'],keywords:['退货','换货','不要了'],criteria:'顾客购买后要求退换商品',flow:[{step:'了解退换原因'},{step:'核实购买记录'},{step:'联系商家处理'}],scripts:[{label:'受理',text:'您好，请问您需要退换的原因是什么？我们会帮您联系商家处理。'}],transferCondition:'商家拒绝则上报班长',notes:'',needReport:false},
            {id:'sc-frozen-goods',title:'冷冻商品未放回冰柜',risk:'mid',tags:['商品管理'],keywords:['冰淇淋','冷冻','没放回去'],criteria:'顾客将冷冻商品拿出后未放回',flow:[{step:'及时提醒顾客放回'}],scripts:[{label:'提醒',text:'您好，如果不购买该冷冻商品，请放回冰柜，避免商品变质，谢谢配合。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'sc-unsealed',title:'拆封商品后放回',risk:'mid',tags:['商品管理'],keywords:['拆开了','撕开包装','开封'],criteria:'顾客拆封商品后放回货架',flow:[{step:'立即介入提醒'},{step:'引导购买或赔偿'}],scripts:[{label:'提醒',text:'您好，该商品已被拆封，无法二次销售，请您购买或按价赔偿。'}],transferCondition:'拒绝配合转二线',notes:'',needReport:false},
            {id:'sc-wrong-goods',title:'骑手拿错货',risk:'mid',tags:['骑手','商品'],keywords:['拿错了','货不对','取错'],criteria:'外卖骑手取错商品',flow:[{step:'核实订单与商品'},{step:'引导放回并取正确商品'}],scripts:[{label:'核实',text:'您好，请核对一下您的订单，确认商品是否正确。'}],transferCondition:'无法处理联系商家',notes:'',needReport:false},
            {id:'sc-merchant-need',title:'商家特殊需求',risk:'mid',tags:['商家','特殊需求'],keywords:['商家要求','特殊要求','老板说'],criteria:'商家有特���的运营需求',flow:[{step:'了解商家具体需求'},{step:'记录在重点关注'},{step:'按需求执行'}],scripts:[],transferCondition:'需求超出权限上报班长',notes:'',needReport:false},
            {id:'sc-damage-intent',title:'故意损坏商品',risk:'high',tags:['破坏','赔偿'],keywords:['故意摔','砸商品','故意破坏'],criteria:'顾客故意损坏商品',flow:[{step:'立即制止'},{step:'要求赔偿'},{step:'拒绝赔偿锁门转二线'}],scripts:[{label:'要求赔偿',text:'您好，您损坏了店内商品，需要按价赔偿，请您配合。'}],transferCondition:'拒绝赔偿立即转二线',notes:'',needReport:true},
            {id:'sc-damage-accident',title:'意外损坏商品',risk:'mid',tags:['破坏','意外'],keywords:['不小心','意外','碰倒'],criteria:'顾客意外损坏商品',flow:[{step:'安抚顾客'},{step:'联系商家确认处理方式'}],scripts:[{label:'安抚',text:'没关系，我们来联系商家确认处理方式。'}],transferCondition:'按商家要求处理',notes:'',needReport:false},
            {id:'sc-photo',title:'顾客进店拍摄',risk:'low',tags:['行为'],keywords:['拍照','录像','拍摄'],criteria:'顾客在店内拍摄',flow:[{step:'询问目的'},{step:'商家介意则礼貌制止'}],scripts:[{label:'制止',text:'您好，本店不允许拍摄，请您配合，谢谢。'}],transferCondition:'拒不配合转二线',notes:'',needReport:false}
          ]
        },
        {
          id: 'sc-customer-behavior',
          name: '顾客行为类',
          icon: '👥',
          desc: '非常规行为、不当行为、常规服务',
          scenarios: [
            {id:'sc-beh-smoke',title:'店内吸烟',risk:'mid',tags:['不当行为'],keywords:['吸烟','抽烟'],criteria:'顾客在店内吸烟',flow:[{step:'立即介入制止'}],scripts:[{label:'制止',text:'本店禁止吸烟，请您将香烟熄灭至店外，感谢您的配合。'}],transferCondition:'拒不配合转二线',notes:'',needReport:false},
            {id:'sc-beh-longstay',title:'长时间滞留',risk:'low',tags:['滞留'],keywords:['一直在','不走','滞留'],criteria:'顾客长时间滞留不购物',flow:[{step:'主动询问需求'},{step:'根据情况处理'}],scripts:[{label:'询问',text:'请问有什么可以帮到您的？'}],transferCondition:'有特殊需求转二线',notes:'',needReport:false},
            {id:'sc-beh-fight',title:'顾客打架斗殴',risk:'high',tags:['安全','冲突'],keywords:['打架','斗殴','冲突'],criteria:'顾客发生肢体冲突',flow:[{step:'立即介入劝阻'},{step:'转二线+上报班长'}],scripts:[{label:'劝阻',text:'请停止冲突，保持秩序。'}],transferCondition:'立即转二线+上报班长',notes:'',needReport:true},
            {id:'sc-beh-child',title:'携带儿童/宠物进店',risk:'low',tags:['主动服务'],keywords:['小孩','宠物','狗','猫'],criteria:'携带儿童或宠物进店',flow:[{step:'提醒看顾儿童'},{step:'宠物引导至店外'}],scripts:[{label:'儿童',text:'请看顾好您的小朋友，避免受伤。'},{label:'宠物',text:'本店禁止宠物入内，请将宠物带至店外。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'sc-beh-drunk',title:'醉酒顾客闹事',risk:'high',tags:['安全','特殊人群'],keywords:['醉酒','喝醉','闹事'],criteria:'醉酒顾客在店内滋事',flow:[{step:'备注情况'},{step:'立即转二线'}],scripts:[],transferCondition:'立即转二线',notes:'',needReport:false},
            {id:'sc-beh-homeless',title:'流浪人员进店',risk:'mid',tags:['特殊人群'],keywords:['流浪','乞讨'],criteria:'流浪人员进店',flow:[{step:'礼貌询问是否购物'},{step:'非购物引导离店'}],scripts:[{label:'引导',text:'您好，请问您是来购物的吗？'}],transferCondition:'拒绝离店转二线',notes:'',needReport:false}
          ]
        },
        {
          id: 'sc-safety2',
          name: '安全风险类',
          icon: '🛡️',
          desc: '财产安全、人身安全、紧急情况处置',
          scenarios: [
            {id:'sc-fire',title:'店内发生火情',risk:'high',tags:['紧急','消防'],keywords:['着火','冒烟','火灾'],criteria:'店内出现火情',flow:[{step:'立即开门疏散'},{step:'通知商家'},{step:'上报班长'},{step:'拨打119'}],scripts:[],transferCondition:'立即转二线+上报班长',notes:'生命安全优先立即开门',needReport:true},
            {id:'sc-medical',title:'顾客突发疾病',risk:'high',tags:['紧急','急救'],keywords:['晕倒','突发','急救','不舒服'],criteria:'顾客突发疾病',flow:[{step:'立即开门'},{step:'建议拨打120'},{step:'上报班长'}],scripts:[{label:'询问',text:'您好，需要帮您联系急救吗？'}],transferCondition:'立即转二线+上报班长',notes:'生命安全优先',needReport:true},
            {id:'sc-property',title:'财产安全威胁',risk:'high',tags:['财产安全'],keywords:['可疑','威胁','危险'],criteria:'发现财产安全威胁',flow:[{step:'密切监控'},{step:'主动介入'},{step:'无法处理转二线'}],scripts:[],transferCondition:'无法处理立即转二线',notes:'',needReport:true}
          ]
        }
      ]
    },
    {
      id: 'system-device',
      name: '系统与设备',
      icon: '🖥️',
      color: 'secondary',
      desc: '工作台操作、后台管理、设备维护、在线服务操作',
      categories: [
        {
          id: 'sys-workstation',
          name: '工作台操作',
          icon: '💻',
          desc: '值守工作台的日常操作规范',
          scenarios: [
            {id:'sys-lock-door',title:'远程锁门操作',risk:'low',tags:['工作台','门禁'],keywords:['锁门','L键','远程锁'],criteria:'需要远程锁定门禁',flow:[{step:'按L键触发锁门'},{step:'确认门禁状态'},{step:'备注锁门原因'}],scripts:[],transferCondition:'锁门失败立即转二线',notes:'锁门快捷键为L键',needReport:false},
            {id:'sys-open-door',title:'远程开门操作',risk:'low',tags:['工作台','门禁'],keywords:['开门','远程开','手动开门'],criteria:'需要远程开启门禁',flow:[{step:'核实顾客身份和支付状态'},{step:'操作工作台开门'},{step:'确认门已打开'}],scripts:[],transferCondition:'开门失败通知商家',notes:'开门前务必核实支付',needReport:false},
            {id:'sys-copy-info',title:'复制店铺信息',risk:'low',tags:['工作台','操作'],keywords:['复制店铺','店铺信息'],criteria:'需要复制店铺信息进行备注',flow:[{step:'找到店铺信息模块'},{step:'点击复制按钮'},{step:'粘贴到备注栏'}],scripts:[],transferCondition:'',notes:'转交二线前必须复制店铺信息',needReport:false},
            {id:'sys-transfer',title:'转交二线操作',risk:'low',tags:['工作台','转交'],keywords:['转交','转人工'],criteria:'需要将工单转交二线���服',flow:[{step:'确认需转交的原因'},{step:'复制店铺信息'},{step:'填写备注内容'},{step:'点击转交按钮'}],scripts:[],transferCondition:'',notes:'备注要详细，转交后跟进结果',needReport:false}
          ]
        },
        {
          id: 'sys-backend',
          name: '后台管理',
          icon: '⚙️',
          desc: '后台系统的管理操作',
          scenarios: [
            {id:'sys-blacklist',title:'黑名单管理',risk:'low',tags:['后台','管理'],keywords:['黑名单','拉黑','屏蔽'],criteria:'需要将顾客加入黑名单',flow:[{step:'进入后台管理页面'},{step:'找到黑名单功能'},{step:'添加顾客信息'},{step:'保存设置'}],scripts:[],transferCondition:'操作失败联系技术支持',notes:'',needReport:false},
            {id:'sys-key-note',title:'重点关注设置',risk:'low',tags:['后台','管理'],keywords:['重点关注','备注重点'],criteria:'需要标记重点关注事项',flow:[{step:'进入店铺重点关注'},{step:'添加注意事项'},{step:'确认保存'}],scripts:[],transferCondition:'',notes:'',needReport:false}
          ]
        },
        {
          id: 'sys-online',
          name: '在线服务操作',
          icon: '🌐',
          desc: '在线客服、远程协助的操作规范',
          scenarios: [
            {id:'sys-chat',title:'在线对���服务',risk:'low',tags:['在线服务'],keywords:['在线','聊天','文字服务'],criteria:'通过文字与顾客沟通',flow:[{step:'主动问候'},{step:'了解顾客需求'},{step:'提供解决方案'},{step:'确认问题解决'}],scripts:[{label:'问候',text:'您好，欢迎光临，请问有什么可以帮到您的？'}],transferCondition:'无法解决则转二线',notes:'',needReport:false},
            {id:'sys-alarm',title:'警报响应处理',risk:'mid',tags:['警报','响应'],keywords:['警报','报警','报警声'],criteria:'系统触发警报',flow:[{step:'立即查看监控画面'},{step:'核实警报原因'},{step:'根据情况处理'},{step:'记录警报处理结果'}],scripts:[],transferCondition:'高风险警报立即转二线',notes:'',needReport:false}
          ]
        }
      ]
    },
    {
      id: 'tools-norms',
      name: '工具与规范',
      icon: '📚',
      color: 'success',
      desc: '培训资料、操作规范、话术模板、服务标准',
      categories: [
        {
          id: 'tn-scripts',
          name: '标准话术',
          icon: '💬',
          desc: '各场景标准话术模板',
          scenarios: [
            {id:'tn-greeting',title:'开场问候话术',risk:'low',tags:['话术','服务'],keywords:['问候','欢迎','你好'],criteria:'顾客进店或联系时的标准问候',flow:[{step:'主动问候顾客'},{step:'询问需求'}],scripts:[{label:'标准问候',text:'您好，欢迎光临，请问有什么可以帮到您的？'},{label:'顾客进店',text:'您好，请问您需要帮助吗？'}],transferCondition:'',notes:'',needReport:false},
            {id:'tn-apology',title:'致歉话术',risk:'low',tags:['话术','致歉'],keywords:['道歉','抱歉','不好意思'],criteria:'需要向顾客致歉时',flow:[{step:'表达歉意'},{step:'解释情况'},{step:'提出解决方案'}],scripts:[{label:'标准致歉',text:'非常抱歉给您带来不好的体验，我们会尽快解决，感谢您的理解。'},{label:'设备故障致歉',text:'非常抱歉，设备出现临时故障，我们正在紧急处理，感谢您的耐心等待。'}],transferCondition:'',notes:'',needReport:false},
            {id:'tn-refusal',title:'拒绝服务话术',risk:'low',tags:['话术','拒绝'],keywords:['拒绝','不能','不允许'],criteria:'需要礼貌拒绝顾客不合理请求',flow:[{step:'礼貌说明原因'},{step:'提供替代方案（如有）'}],scripts:[{label:'拒绝未成年购烟酒',text:'您好，根据相关规定，购买烟酒需要年满18周岁并出示有效身份证，请您配合。'},{label:'拒绝不合规请求',text:'非常抱歉，您的请求不符合相关规定，我们无法为您提供该服务。'}],transferCondition:'',notes:'',needReport:false}
          ]
        },
        {
          id: 'tn-standards',
          name: '服务规范',
          icon: '📋',
          desc: '服务标准、行为准则、考核要求',
          scenarios: [
            {id:'tn-response-time',title:'响应时效规范',risk:'low',tags:['规范','时效'],keywords:['响应时间','处理时效'],criteria:'客服响应时效标准',flow:[{step:'收到信息立即回复'},{step:'30秒内响应顾客'},{step:'复杂问题告知处理时效'}],scripts:[],transferCondition:'',notes:'响应时效是考核重点指标',needReport:false},
            {id:'tn-handover',title:'交接班规范',risk:'low',tags:['规范','交接'],keywords:['交接班','交班','接班'],criteria:'班次交接的标准流程',flow:[{step:'整理当前未完成工单'},{step:'检查门禁状态'},{step:'向接班人传达重点事项'},{step:'完成交接记录'}],scripts:[],transferCondition:'',notes:'交接班必须确保无遗漏工单',needReport:false}
          ]
        }
      ]
    },
    {
      id: 'special-zone',
      name: '专项分区',
      icon: '⭐',
      color: 'danger',
      desc: '各品牌/业态专项操作规范：周黑鸭、红旗等',
      categories: [
        {
          id: 'sp-zhouniya',
          name: '周黑鸭专项',
          icon: '🦆',
          desc: '周黑鸭门店专用操作规范与场景处理',
          scenarios: [
            {id:'sp-zhy-order',title:'周黑鸭订单处理',risk:'low',tags:['周黑鸭','订单'],keywords:['周黑鸭','订单','取货'],criteria:'周黑鸭相关订单处理',flow:[{step:'核实周黑鸭订单信息'},{step:'引导顾客正确取货'},{step:'确认订单核销'}],scripts:[{label:'引导',text:'您好，请出示您的周黑鸭订单二维码，我为您核实后取货。'}],transferCondition:'订单异常联系商家',notes:'',needReport:false},
            {id:'sp-zhy-product',title:'周黑鸭商品称重',risk:'low',tags:['周黑鸭','商品'],keywords:['称重','按克','散称'],criteria:'周黑鸭散装商品需要称重结算',flow:[{step:'引导顾客到称重区'},{step:'按重量计算价格'},{step:'协助完成支付'}],scripts:[],transferCondition:'无法处理联系商家',notes:'',needReport:false},
            {id:'sp-zhy-complaint',title:'周黑鸭品质投诉',risk:'mid',tags:['周黑鸭','投诉'],keywords:['周黑鸭','不新鲜','变质','质量'],criteria:'顾客投诉周黑鸭商品品质问题',flow:[{step:'安抚顾客'},{step:'记录投诉详情'},{step:'联系周黑鸭商家处理'}],scripts:[{label:'安抚',text:'非常抱歉，我们会立即联系周黑鸭商家为您处理，请您稍等。'}],transferCondition:'商家不配合上报班长',notes:'',needReport:false}
          ]
        }
      ]
    }
  ]
};
