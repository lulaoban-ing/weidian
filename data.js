const HIGH_FREQ_IDS = [
  'ask-payment','long-stay','underpay','overpay',
  'minor-cigarette','pos-breakdown','merchant-code','door-not-open'
];

const KB_DATA = {
  version: '5.0',
  lastUpdate: '2026-04-21',
  modules: [
    {
      id: 'sop-scenarios',
      name: '全场景 SOP',
      icon: '📋',
      color: 'primary',
      desc: '标准化处理流程，覆盖所有客服场景',
      categories: [
        {
          id: 'basic-reception',
          name: '基础接待',
          icon: '💬',
          desc: '顾客主动咨询、主动服务介入等日常接待场景',
          scenarios: [
            {id:'ask-person',title:'顾客询问店里是否有人',risk:'low',tags:['被动服务','常规'],keywords:['有人吗','有没有人','在吗'],criteria:'顾客呼叫或发出询问',flow:[{step:'及时响应，3秒内回复'},{step:'使用标准话术回应'}],scripts:[{label:'标准话术',text:'请问有什么可以帮您？'}],transferCondition:'无需转人工',notes:'响应时间控制在3秒内',needReport:false},
            {id:'ask-identity',title:'顾客询问值班人员身份',risk:'low',tags:['被动服务','信任建立'],keywords:['你是谁','真人吗','机器人','是客服吗'],criteria:'顾客质疑是否真人值守',flow:[{step:'及时响应'},{step:'说明真人值守'}],scripts:[{label:'标准话术',text:'是的，店铺都是真人在值守。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'ask-payment',title:'顾客询问付款方式',risk:'low',tags:['被动服务','支付引导'],keywords:['怎么付款','怎么支付','付款方式','怎么买'],criteria:'顾客不知道如何支付',flow:[{step:'引导顾客至收银台'},{step:'说明扫码加购流程'},{step:'引导出示付款码支付'}],scripts:[{label:'支付引导',text:'请您移步至收银台，将商品条形码对准扫码盒加购，加购完商品后，出示付款码对准扫码盒支付即可。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'ask-price',title:'顾客询问商品价格',risk:'low',tags:['被动服务','价格查询'],keywords:['多少钱','价格','价钱','怎么卖'],criteria:'顾客询问价格',flow:[{step:'引导顾客扫码查看价格'}],scripts:[{label:'标准话术',text:'请将商品条形码对准扫码盒扫描即可看到价格。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'ask-location',title:'顾客询问商品位置',risk:'low',tags:['被动服务','商品指引'],keywords:['在哪','在哪里','哪个区','找不到'],criteria:'顾客找不到商品',flow:[{step:'引导大致范围查找'},{step:'若未找到则致歉'},{step:'引导选购替代商品或等店员到店'}],scripts:[{label:'引导话术',text:'请您移步至XX用品区查看是否有您需要的商品。'},{label:'致歉话术',text:'实在抱歉，此类商品可能已经售空，您可以看一下店内是否有其他商品可以替代，或等店主到店后再来购买。'}],transferCondition:'药店询问商品位置需转交二线协助查询',notes:'药店询问商品位置需转交二线客服协助查询具体位置',needReport:false},
            {id:'open-door',title:'协助顾客开门离店',risk:'low',tags:['主动服务','开门'],keywords:['开门','出不去','门打不开','离店'],criteria:'顾客无法正常离店',flow:[{step:'确认顾客购物流程无异常'},{step:'按O键远程开门'},{step:'引导顾客离店'}],scripts:[{label:'开门话术',text:'门已经帮您打开了，请携带好您的随身物品离店，期待您的下次光临。'}],transferCondition:'无需转人工',notes:'严禁将店外人员放入，只能协助店内顾客离店',needReport:false},
            {id:'long-stay',title:'顾客长时间在店',risk:'low',tags:['主动服务','滞留'],keywords:['长时间','一直在','不走','滞留','待很久'],criteria:'顾客在店超过正常购物时间',flow:[{step:'主动询问顾客诉求'},{step:'根据回复进行相应处理'}],scripts:[{label:'询问话术',text:'请问有什么可以帮到您的？'}],transferCondition:'顾客有特殊需求则转二线',notes:'',needReport:false},
            {id:'smoking',title:'顾客在店内吸烟',risk:'mid',tags:['主动服务','安全','禁止行为'],keywords:['吸烟','抽烟','点烟','打火机'],criteria:'发现顾客在店内吸烟',flow:[{step:'立即介入制止'},{step:'使用标准话术提醒'}],scripts:[{label:'制止话术',text:'本店禁止吸烟，请您将香烟熄灭至店外，感谢您的配合。'}],transferCondition:'顾客拒不配合则转二线',notes:'',identifyTips:['顾客手持香烟','闻到烟味','看到烟雾'],needReport:false},
            {id:'child-pet',title:'顾客携带儿童/宠物进店',risk:'low',tags:['主动服务','安全'],keywords:['小孩','儿童','宠物','狗','猫','宝宝'],criteria:'发现儿童或宠物进店',flow:[{step:'及时介入提醒'}],scripts:[{label:'儿童提醒',text:'请您看顾好您的小朋友，避免磕伤碰伤。'},{label:'宠物提醒',text:'本店禁止宠物入内，请将宠物带离至店外。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'multi-goods',title:'顾客购买多件商品（6件及以上）',risk:'low',tags:['主动服务','多件商品','防漏付'],keywords:['多件','好多','一堆','六大件'],criteria:'顾客购买商品数量达6件及以上',flow:[{step:'主动提醒顾客逐件扫码'},{step:'利用利己心理引导'}],scripts:[{label:'提醒话术',text:'为了避免您多付，请您一件一件扫码加购，核对好数量后，再进行付款。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'fridge-open',title:'冰箱门未关',risk:'low',tags:['主动服务','设备'],keywords:['冰箱','冰柜','门没关','开着'],criteria:'监控发现冰箱门未关',flow:[{step:'店内有顾客：提醒顾客关好冰箱门'},{step:'店内无顾客：转交二线处理'}],scripts:[{label:'提醒话术',text:'辛苦您将店内的冰箱门关好，感谢您的配合。'}],transferCondition:'无顾客时转二线',notes:'',needReport:false}
          ]
        },
        {
          id: 'product-issues',
          name: '商品问题',
          icon: '📦',
          desc: '无码商品、条形码异常、等价置换、药品追溯等',
          scenarios: [
            {id:'barcode-unreadable',title:'商品条形码无法识别',risk:'low',tags:['商品问题','条形码'],keywords:['扫不上','扫不出','条形码'],criteria:'顾客扫码时POS机无法识别',flow:[{step:'引导重新扫描'},{step:'遮挡二维码尝试'}],scripts:[{label:'话术',text:'商品条形码没有扫全，辛苦您再扫一下。如果旁边有��维码，您将二维码遮挡一下就可以扫描成功了。'}],transferCondition:'无法解决则转二线',notes:'',needReport:false},
            {id:'no-barcode-product',title:'商品无条形码',risk:'low',tags:['商品问题','无码'],keywords:['无码','没条码','散装'],criteria:'商品本身无条形码',flow:[{step:'引导更换其他有条码商品代替'},{step:'顾客不配合则转交二线'}],scripts:[{label:'话术',text:'这件商品还没有入库，暂时无法购买，麻烦您更换其他商品。'}],transferCondition:'顾客不配合则转二线',notes:'',needReport:false},
            {id:'medicine-trace',title:'药品追溯码必扫',risk:'low',tags:['商品问题','药品'],keywords:['药品','追溯码'],criteria:'顾客购买药品',flow:[{step:'先扫条形码'},{step:'系统提示后扫追溯码'}],scripts:[{label:'流程',text:'根据国家政策要求，售药必扫，执行一物一码、扫码留痕。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'unpack-goods',title:'未支付商品拆封',risk:'mid',tags:['商品破坏'],keywords:['拆开','拆封','撕开'],criteria:'发现顾客拆封未付款商品',flow:[{step:'立即介入提醒付款'},{step:'顾客拒付则转二线'}],scripts:[{label:'制止',text:'请您先移步至收银台将商品扫码付款再进行使用。'}],transferCondition:'顾客拒付立即转二线',notes:'情趣用品一经拆包必须购买',needReport:false}
          ]
        },
        {
          id: 'payment-issues',
          name: '支付问题',
          icon: '💳',
          desc: '余额不足、网络延迟、重复支付、现金、私码等',
          scenarios: [
            {id:'balance-insufficient',title:'余额不足/支付失败',risk:'low',tags:['支付'],keywords:['余额不足','支付失败','没钱'],criteria:'支付时提示余额不足',flow:[{step:'引导更换支付方式'}],scripts:[{label:'话术',text:'支付失败，您更换一下支付方式再次尝试。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'pos-breakdown',title:'POS机无法使用',risk:'mid',tags:['设备故障'],keywords:['pos机','不能用','黑屏'],criteria:'POS机故障',flow:[{step:'引导使用小程序付款'},{step:'引导重启POS机'}],scripts:[{label:'小程序',text:'您下拉微信聊天界面，打开【微店加加】小程序点击扫码购物即可。'}],transferCondition:'重启无效则上报班长',notes:'',needReport:false},
            {id:'underpay',title:'少付/漏付',risk:'high',tags:['资金风险'],keywords:['少付','漏付','没付全'],criteria:'实际支付少于应付',flow:[{step:'按L键锁门'},{step:'转交二线处理'}],scripts:[],transferCondition:'立即转二线+锁门',notes:'高风险必须锁门',needReport:true},
            {id:'overpay',title:'多付/重复支付',risk:'mid',tags:['资金风险'],keywords:['多付','重复付','付了两次'],criteria:'支付金额超出应付',flow:[{step:'备注事件'},{step:'转交二线'}],scripts:[],transferCondition:'转二线处理退款',notes:'',needReport:false},
            {id:'merchant-code',title:'扫描商家收款码',risk:'mid',tags:['私码'],keywords:['商家码','老板码','私人码'],criteria:'顾客扫了商家私人码',flow:[{step:'引导在POS机重新支付'},{step:'顾客拒绝则上报班长'}],scripts:[{label:'引导',text:'辛苦您在POS机上重新支付，不然门无法打开，多付款项我们会联系商家退还。'}],transferCondition:'顾客拒绝则上报',notes:'',needReport:true}
          ]
        }
      ]
    },
    {
      id: 'exception-handling',
      name: '异常处理 SOP',
      icon: '⚠️',
      color: 'warning',
      desc: '非常规情况、投诉升级、特殊人群处理',
      categories: [
        {
          id: 'special-groups',
          name: '特殊人群',
          icon: '👥',
          desc: '未成年购烟、制服人员、醉酒闹事等',
          scenarios: [
            {id:'minor-cigarette',title:'未成年购买香烟',risk:'high',tags:['特殊人群','合规'],keywords:['未成年','学生','买烟'],criteria:'疑似未成年购烟',flow:[{step:'主动介入询问年龄'},{step:'要求出示身份证'},{step:'未满18岁拒绝售卖'}],scripts:[{label:'询问',text:'您好，购买香烟需要年满18周岁，请问您满18岁了吗？请出示您的身份证。'}],transferCondition:'顾客拒不配合转二线',notes:'',identifyTips:['穿校服','背书包','身高矮小','面部稚嫩'],needReport:false},
            {id:'uniform-person',title:'制服人员进店',risk:'high',tags:['特殊人群','执法'],keywords:['制服','执法','检查','工商'],criteria:'制服人员进店',flow:[{step:'主动询问来意'},{step:'公务检查立即转二线+备注'}],scripts:[{label:'询问',text:'请问您是来购物还是有其他事项？'}],transferCondition:'公务检查立即转二线',notes:'',needReport:false},
            {id:'drunk-customer',title:'顾客醉酒闹事',risk:'high',tags:['特殊人群','安全'],keywords:['醉酒','喝醉','闹事'],criteria:'顾客醉酒',flow:[{step:'备注情况'},{step:'转接二线'}],scripts:[],transferCondition:'立即转二线',notes:'',needReport:false}
          ]
        },
        {
          id: 'security-safety',
          name: '安全问题',
          icon: '🚨',
          desc: '偷盗、倚门盗抢、食品安全等高风险场景',
          scenarios: [
            {id:'theft-instore',title:'店内小型偷盗',risk:'high',tags:['偷盗','资金安全'],keywords:['偷','盗','藏商品','夹带'],criteria:'发现偷盗行为',flow:[{step:'按L键强制锁门'},{step:'复制店铺信息'},{step:'备注详情'},{step:'转交二线'},{step:'上报班长'}],scripts:[],transferCondition:'立即转二线+上报班长',notes:'高风险必须上报班长',needReport:true},
            {id:'theft-door',title:'倚门盗抢',risk:'high',tags:['盗抢','人身安全'],keywords:['抢','门口','盗抢','强抢'],criteria:'门口发生盗抢',flow:[{step:'复制店铺信息'},{step:'备注详情'},{step:'转交二线'},{step:'上报班长'}],scripts:[],transferCondition:'立即转二线+上报班长',notes:'倚门盗抢不锁门，避免冲突',needReport:true},
            {id:'food-expired',title:'商品过期/变质投诉',risk:'high',tags:['食品安全'],keywords:['过期','变质','发霉'],criteria:'顾客投诉食品问题',flow:[{step:'优先安抚'},{step:'引导将商品放显眼位置'},{step:'上报班长联系商家'}],scripts:[{label:'安抚',text:'实在抱歉，辛苦您将商品放在收银台上，我们马上通知商家处理。'}],transferCondition:'上报班长',notes:'',needReport:true},
            {id:'door-not-open',title:'门无法打开/系统故障',risk:'mid',tags:['设备故障'],keywords:['门打不开','系统故障','卡住了'],criteria:'门禁系统故障',flow:[{step:'尝试按O键开门'},{step:'无效则转二线+上报班长'}],scripts:[],transferCondition:'无效立即转二线',notes:'',needReport:false}
          ]
        }
      ]
    },
    {
      id: 'ai-watching',
      name: 'AI 值守操作',
      icon: '🤖',
      color: 'success',
      desc: 'AI 客服操作规范与云值守 SOP',
      categories: [
        {
          id: 'ai-operation',
          name: 'AI 操作规范',
          icon: '⚙️',
          desc: 'AI 客服系统操作流程与注意事项',
          scenarios: [
            {id:'ai-false-alarm',title:'AI 识别异常-误报处理',risk:'low',tags:['AI操作','误报'],keywords:['误报','识别错误','标红'],criteria:'系统标红但实际无异常',flow:[{step:'查看工作台左上角异常描述'},{step:'结合监控画面判断是否真实异常'},{step:'确认为误报后点击"误报"按键'},{step:'按常规流程继续值守'}],scripts:[],transferCondition:'确认真实异常则转二线',notes:'误报按键仅在系统识别异常后出现，点击后按常规流程值守',needReport:false},
            {id:'ai-system-assign',title:'系统分配-AI 识别无异常',risk:'low',tags:['AI操作','系统分配'],keywords:['系统分配','无异常','自动分配'],criteria:'AI agent 初判无异常，系统分配给客服',flow:[{step:'接收系统分配店铺'},{step:'查看 AI 识别结果'},{step:'无异常则按常规流程值守'},{step:'发现异常则及时介入或转二线'}],scripts:[],transferCondition:'发现异常立即处理',notes:'AI识别结果为异常时工作台即时标红预警，需优先介入',needReport:false},
            {id:'ai-pre-shift',title:'上线前准备',risk:'low',tags:['AI操作','上线'],keywords:['上线','准备','登录'],criteria:'开始值守前',flow:[{step:'检查设备：鼠标、耳机、键盘、主副屏、主机、摄像头'},{step:'打开四个软件：企业微信、谷歌浏览器、PhotoBooth、AI值守工作台'},{step:'调整摄像头角度，保持人物居中，微笑服务'},{step:'调整系统输入音量至最大'},{step:'确认大屏为主显示器'},{step:'登录 AI 值守工作台账号'},{step:'登录客服后台账号'},{step:'按 F 键唤起界面，点击"下班"切换为在线状态'},{step:'首次上线需录制语音包'}],scripts:[],transferCondition:'无需转人工',notes:'语音包录制：环境安静后录制，每人仅有十次机会，声音不低于20秒',needReport:false},
            {id:'ai-shift-end',title:'下班/休息店铺交接',risk:'low',tags:['AI操作','交接','下班'],keywords:['下班','挂起','排休','交接'],criteria:'需要下班或休息',flow:[{step:'按 F 键唤起控制台'},{step:'点击"下班"/"排休"/"挂起"对应按钮'},{step:'系统停止分配新店铺，处理完当前所有店铺后方可离席'},{step:'值班店长转交的店铺：商家在店/店内休息均可直接释放'},{step:'系统分配的店铺：无异常按常规流程，有异常转二线'}],scripts:[],transferCondition:'无需转人工',notes:'点击下班后系统只停止分配，必须将屏幕上所有店铺处理完毕才能离席',needReport:false}
          ]
        },
        {
          id: 'cloud-watching',
          name: '云值守 SOP',
          icon: '☁️',
          desc: '远程值守标准操作流程',
          scenarios: [
            {id:'full-passive',title:'客服完全介入-被动服务',risk:'low',tags:['完全介入','被动服务'],keywords:['询问','有人吗','付款方式','商品价格','值班人员'],criteria:'常规顾客主动发起咨询',flow:[{step:'顾客询问店里是否有人：及时响应'},{step:'顾客询问值班人员身份：说明真人值守'},{step:'顾客询问付款方式：引导至收银台扫码支付'},{step:'顾客询问商品价格：引导扫码查看'}],scripts:[{label:'有人询问',text:'请问有什么可以帮您？'},{label:'身份确认',text:'是的，店铺都是真人在值守。'},{label:'付款引导',text:'请您移步至收银台，将商品条形码对准扫码盒加购，加购完商品后，出示付款码对准扫码盒支付即可。'},{label:'价格查询',text:'请将商品条形码对准扫码盒扫描即可看到价格。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'full-active',title:'客服完全介入-主动服务',risk:'low',tags:['完全介入','主动服务'],keywords:['开门','吸烟','核对商品','多件商品','取快递','儿童','宠物'],criteria:'常规顾客购物，需客服主动介入',flow:[{step:'协助开门离店：确认购物无异常后主动开门，严禁将店外人员放入'},{step:'店内吸烟：及时介入制止'},{step:'核对商品：口头核实数量，信任顾客'},{step:'购买多件商品：提醒逐件扫码避免多付'},{step:'顾客长时间在店：主动询问诉求'},{step:'取快递/团购：询问确认即可'},{step:'携带儿童/宠物：及时提醒'}],scripts:[{label:'开门离店',text:'门已经帮您打开了，请携带好您的随身物品离店，期待您的下次光临。'},{label:'禁止吸烟',text:'本店禁止吸烟，请您将香烟熄灭至店外，感谢您的配合。'},{label:'核对商品',text:'请问您一共购买了几件商品？'},{label:'多件提醒',text:'为了避免您多付，请您一件一件扫码加购，核对好数量后，再进行付款。'},{label:'长时间在店',text:'请问有什么可以帮到您的？'},{label:'取快递',text:'请问您是来取快递/团购商品的吗？'},{label:'儿童提醒',text:'请您看顾好您的小朋友，避免磕伤碰伤。'},{label:'宠物提醒',text:'本店禁止宠物入内，请将宠物带离至店外。'}],transferCondition:'无需转人工',notes:'开门快捷键 O，确认购物流程无异常后方可操作',needReport:false},
            {id:'partial-intervene',title:'客服部分介入',risk:'mid',tags:['部分介入','转二线'],keywords:['找不到商品','兑奖','商家在店','冰箱门','拆包'],criteria:'非常规顾客或需简单介入后转二线',flow:[{step:'询问商品位置：引导大致范围，找不到则致歉引导替代商品'},{step:'商品兑奖：致歉说明云值守期间暂不支持，顾客不认可则转二线'},{step:'商品拆包：立即介入制止，拒付则转二线'},{step:'疑似商家/店员：询问身份，引导报备，转二线核实'},{step:'冰箱门未关：有顾客提醒关门，无顾客转二线'}],scripts:[{label:'找不到商品',text:'请您移步至XX用品区查看是否有您需要的商品。'},{label:'商品售空',text:'实在抱歉，此类商品可能已经售空，您可以看一下店内是否有其他商品可以替代，或等店主到店后再来购买。'},{label:'兑奖致歉',text:'实在抱歉，云值守期间暂不支持兑奖，请您等到店员在店时再进行兑奖。'},{label:'转专员',text:'实在抱歉，客服帮您转接专员处理一下。'},{label:'拆包制止',text:'请您先移步至收银台将商品扫码付款再进行使用。'},{label:'商家询问',text:'请问您是商家/店员到店吗？'},{label:'冰箱提醒',text:'辛苦您将店内的冰箱门关好，感谢您的配合。'}],transferCondition:'顾客不认可或无法处理时转二线',notes:'药店顾客询问商品位置需转二线协助查询具体位置',needReport:false},
            {id:'direct-transfer',title:'客服直接转交二线',risk:'high',tags:['直接转交','高风险'],keywords:['偷盗','少付','多付','骑手','制服','醉酒','投诉','媒体','着火','损坏'],criteria:'高风险、紧急/敏感情况，需第一时间转交二线',flow:[{step:'识别高风险场景（偷盗/少付/多付/特殊人群/舆情/人身安全）'},{step:'复制店铺信息'},{step:'备注情况（选择对应标签+文字说明）'},{step:'转交二线值班店长'},{step:'高风险事件必须上报班长'}],scripts:[{label:'统一话术',text:'这边为您转接专员处理，请您稍等。'}],transferCondition:'立即转二线+上报班长',notes:'人身安全/财产安全/舆情/偷盗完成备注转人工后，必须上报班长',needReport:true},
            {id:'transfer-fail',title:'转人工失败处理',risk:'mid',tags:['转人工','失败处理'],keywords:['转人工失败','无法转接'],criteria:'点击转人工后失败',flow:[{step:'需补标的（偷盗/少付/漏付/多付）：提供店铺ID+事件+时间+顾客手机号上报班长'},{step:'其他转人工失败：记录信息，上报班长处理'}],scripts:[],transferCondition:'上报班长',notes:'',needReport:true}
          ]
        }
      ]
    },
    {
      id: 'script-library',
      name: '标准话术库',
      icon: '💬',
      color: 'primary',
      desc: '各类场景标准话术与沟通技巧',
      categories: [
        {
          id: 'greeting-scripts',
          name: '问候与引导',
          icon: '👋',
          desc: '开场问候、服务引导等基础话术',
          scenarios: [
            {id:'greeting-basic',title:'基础问候话术',risk:'low',tags:['话术','问候'],keywords:['你好','欢迎','问候'],criteria:'顾客进店',flow:[{step:'及时问候'},{step:'询问需求'}],scripts:[{label:'标准问候',text:'您好，欢迎光临，请问有什么可以帮您？'},{label:'简洁问候',text:'您好，有什么可以帮您？'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'guidance-payment',title:'支付引导话术',risk:'low',tags:['话术','支付'],keywords:['支付','付款','扫码'],criteria:'顾客询问支付',flow:[{step:'说明支付流程'}],scripts:[{label:'完整引导',text:'请您移步至收银台，将商品条形码对准扫码盒加购，加购完商品后，出示付款码对准扫码盒支付即可。'},{label:'简化引导',text:'请到收银台扫码加购后，出示付款码支付。'}],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        },
        {
          id: 'apology-scripts',
          name: '致歉与安抚',
          icon: '🙏',
          desc: '投诉处理、问题致歉等话术',
          scenarios: [
            {id:'apology-basic',title:'基础致歉话术',risk:'low',tags:['话术','致歉'],keywords:['抱歉','对不起','不好意思'],criteria:'需要致歉',flow:[{step:'诚恳致歉'},{step:'说明原因'},{step:'提供解决方案'}],scripts:[{label:'标准致歉',text:'实在抱歉给您带来不便，我们会尽快处理。'},{label:'深度致歉',text:'非常抱歉，这是我们的疏忽，我们会立即为您解决。'}],transferCondition:'顾客不满意转二线',notes:'',needReport:false},
            {id:'complaint-handling',title:'投诉处理话术',risk:'mid',tags:['话术','投诉'],keywords:['投诉','不满','差评'],criteria:'顾客投诉',flow:[{step:'耐心倾听'},{step:'表示理解'},{step:'致歉并说明处理方案'},{step:'跟进处理'}],scripts:[{label:'安抚话术',text:'非常理解您的心情，给您带来不好的体验我们深表歉意，我们会认真处理您的问题。'}],transferCondition:'严重投诉立即上报',notes:'',needReport:true}
          ]
        }
      ]
    },
    {
      id: 'tools-standards',
      name: '工具与规范',
      icon: '🔧',
      color: 'default',
      desc: '系统工具使用与操作规范',
      categories: [
        {
          id: 'system-tools',
          name: '系统工具',
          icon: '💻',
          desc: 'POS 机、监控系统等工具使用',
          scenarios: [
            {id:'pos-operation',title:'POS 机操作指南',risk:'low',tags:['工具','POS'],keywords:['pos','收银','扫码'],criteria:'POS 机使用',flow:[{step:'确认 POS 机正常运行'},{step:'引导顾客扫码'},{step:'确认支付成功'}],scripts:[],transferCondition:'故障时转二线',notes:'',needReport:false},
            {id:'monitor-system',title:'监控系统使用',risk:'low',tags:['工具','监控'],keywords:['监控','摄像头','画面'],criteria:'查看监控',flow:[{step:'登录监控系统'},{step:'切换摄像头视角'},{step:'回放录像'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        },
        {
          id: 'operation-standards',
          name: '操作规范',
          icon: '📐',
          desc: '值守操作标准与注意事项',
          scenarios: [
            {id:'service-standards',title:'服务标准规范',risk:'low',tags:['规范','服务'],keywords:['标准','规范','要求'],criteria:'日常服务',flow:[{step:'保持礼貌用语'},{step:'及时响应顾客'},{step:'准确处理问题'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'security-standards',title:'安全操作规范',risk:'mid',tags:['规范','安全'],keywords:['安全','规范','注意'],criteria:'涉及安全操作',flow:[{step:'评估风险等级'},{step:'按规范操作'},{step:'必要时上报'}],scripts:[],transferCondition:'高风险立即上报',notes:'',needReport:false}
          ]
        }
      ]
    },
    {
      id: 'training-learning',
      name: '培训学习区',
      icon: '📚',
      color: 'success',
      desc: '新人培训与技能提升资料',
      categories: [
        {
          id: 'newcomer-training',
          name: '新人培训',
          icon: '🎓',
          desc: '新员工入职培训内容',
          scenarios: [
            {id:'onboarding-guide',title:'新人入职指南',risk:'low',tags:['培训','入职'],keywords:['新人','入职','培训'],criteria:'新员工入职',flow:[{step:'了解公司文化'},{step:'学习基础操作'},{step:'熟悉工作流程'},{step:'实操练习'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'basic-skills',title:'基础技能培训',risk:'low',tags:['培训','技能'],keywords:['技能','学习','培训'],criteria:'技能培训',flow:[{step:'学习理论知识'},{step:'观看操作演示'},{step:'实际操作练习'},{step:'考核评估'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        },
        {
          id: 'advanced-learning',
          name: '进阶学习',
          icon: '🚀',
          desc: '高级技能与专项提升',
          scenarios: [
            {id:'communication-skills',title:'沟通技巧提升',risk:'low',tags:['学习','沟通'],keywords:['沟通','技巧','提升'],criteria:'沟通能力提升',flow:[{step:'学习沟通理论'},{step:'分析案例'},{step:'模拟练习'},{step:'实战应用'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'problem-solving',title:'问题处理能力',risk:'low',tags:['学习','问题处理'],keywords:['问题','处理','能力'],criteria:'问题处理能力提升',flow:[{step:'学习处理方法'},{step:'案例分析'},{step:'总结经验'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        }
      ]
    },
    {
      id: 'case-review',
      name: '案例复盘区',
      icon: '📊',
      color: 'warning',
      desc: '典型案例分析与经验总结',
      categories: [
        {
          id: 'typical-cases',
          name: '典型案例',
          icon: '📝',
          desc: '常见问题处理案例',
          scenarios: [
            {id:'case-theft',title:'偷盗案例分析',risk:'high',tags:['案例','偷盗'],keywords:['偷盗','案例','分析'],criteria:'偷盗事件复盘',flow:[{step:'回顾事件经过'},{step:'分析处理过程'},{step:'总结经验教训'},{step:'提出改进措施'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'case-complaint',title:'投诉处理案例',risk:'mid',tags:['案例','投诉'],keywords:['投诉','案例','处理'],criteria:'投诉事件复盘',flow:[{step:'回顾投诉内容'},{step:'分析处理方式'},{step:'总结沟通技巧'},{step:'优化服务流程'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        },
        {
          id: 'best-practices',
          name: '优秀实践',
          icon: '⭐',
          desc: '优秀服务案例与经验分享',
          scenarios: [
            {id:'excellent-service',title:'优质服务案例',risk:'low',tags:['案例','优秀'],keywords:['优秀','服务','案例'],criteria:'优秀服务复盘',flow:[{step:'分享服务过程'},{step:'总结成功要点'},{step:'推广优秀经验'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'innovation-practice',title:'创新实践案例',risk:'low',tags:['案例','创新'],keywords:['创新','实践','案例'],criteria:'创新做法复盘',flow:[{step:'介绍创新做法'},{step:'分析效果'},{step:'推广应用'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        }
      ]
    }
  ]
};

const ADMIN_CONFIG = {
  passwordHash: 'd2VpZGlhbjI0YWRtaW4='
};
