const HIGH_FREQ_IDS = [
  'ask-payment','long-stay','underpay','overpay',
  'minor-cigarette','pos-breakdown','merchant-code','door-not-open'
];

const KB_DATA = {
  version: '6.0',
  lastUpdate: '2026-04-22',
  modules: [
    {
      id: 'ai-watching',
      name: 'AI 值守专区',
      icon: '🤖',
      color: 'primary',
      desc: 'AI 值守岗位专用：远程监控、实时响应、系统操作',
      categories: [
        {
          id: 'ai-risk',
          name: '异常与风险',
          icon: '🚨',
          desc: '偷盗识别、风险预警、身份核实',
          scenarios: [
            {id:'theft-instore',title:'店内小型偷盗',risk:'high',tags:['偷盗','资金安全'],keywords:['偷','盗','藏商品','夹带'],criteria:'发现偷盗行为',flow:[{step:'按L键强制锁门'},{step:'复制店铺信息'},{step:'备注详情'},{step:'转交二线'},{step:'上报班长'}],scripts:[],transferCondition:'立即转二线+上报班长',notes:'高风险必须上报班长',needReport:true},
            {id:'theft-door',title:'倚门盗抢',risk:'high',tags:['盗抢','人身安全'],keywords:['抢','门口','盗抢','强抢'],criteria:'门口发生盗抢',flow:[{step:'复制店铺信息'},{step:'备注详情'},{step:'转交二线'},{step:'上报班长'}],scripts:[],transferCondition:'立即转二线+上报班长',notes:'倚门盗抢不锁门，避免冲突',needReport:true},
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
            {id:'long-stay',title:'顾客长时间在店',risk:'low',tags:['主动服务','滞留'],keywords:['长时间','一直在','不走','滞留','待很久'],criteria:'顾客在店超过正常购物时间',flow:[{step:'主动询问顾客诉求'},{step:'根据回复进行相应处理'}],scripts:[{label:'询问话术',text:'请问有什么可以帮到您的？'}],transferCondition:'顾客有特殊需求则转二线',notes:'',needReport:false},
            {id:'child-pet',title:'顾客携带儿童/宠物进店',risk:'low',tags:['主动服务','安全'],keywords:['小孩','儿童','宠物','狗','猫','宝宝'],criteria:'发现儿童或宠物进店',flow:[{step:'及时介入提醒'}],scripts:[{label:'儿童提醒',text:'请您看顾好您的小朋友，避免磕伤碰伤。'},{label:'宠物提醒',text:'本店禁止宠物入内，请将宠物带离至店外。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'unpack-goods',title:'未支付商品拆封',risk:'mid',tags:['商品破坏'],keywords:['拆开','拆封','撕开'],criteria:'发现顾客拆封未付款商品',flow:[{step:'立即介入提醒付款'},{step:'顾客拒付则转二线'}],scripts:[{label:'制止',text:'请您先移步至收银台将商品扫码付款再进行使用。'}],transferCondition:'顾客拒付立即转二线',notes:'情趣用品一经拆包必须购买',needReport:false}
          ]
        },
        {
          id: 'ai-payment',
          name: '商品与支付',
          icon: '💳',
          desc: '支付异常、条码问题、多付少付处理',
          scenarios: [
            {id:'ask-payment',title:'顾客询问付款方式',risk:'low',tags:['被动服务','支付引导'],keywords:['怎么付款','怎么支付','付款方式','怎么买'],criteria:'顾客不知道如何支付',flow:[{step:'引导顾客至收银台'},{step:'说明扫码加购流程'},{step:'引导出示付款码支付'}],scripts:[{label:'支付引导',text:'请您移步至收银台，将商品条形码对准扫码盒加购，加购完商品后，出示付款码对准扫码盒支付即可。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'balance-insufficient',title:'余额不足/支付失败',risk:'low',tags:['支付'],keywords:['余额不足','支付失败','没钱'],criteria:'支付时提示余额不足',flow:[{step:'引导更换支付方式'}],scripts:[{label:'话术',text:'支付失败，您更换一下支付方式再次尝试。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'overpay',title:'多付/重复支付',risk:'mid',tags:['资金风险'],keywords:['多付','重复付','付了两次'],criteria:'支付金额超出应付',flow:[{step:'备注事件'},{step:'转交二线'}],scripts:[],transferCondition:'转二线处理退款',notes:'',needReport:false},
            {id:'barcode-unreadable',title:'商品条形码无法识别',risk:'low',tags:['商品问题','条形码'],keywords:['扫不上','扫不出','条形码'],criteria:'顾客扫码时POS机无法识别',flow:[{step:'引导重新扫描'},{step:'遮挡二维码尝试'}],scripts:[{label:'话术',text:'商品条形码没有扫全，辛苦您再扫一下。如果旁边有二维码，您将二维码遮挡一下就可以扫描成功了。'}],transferCondition:'无法解决则转二线',notes:'',needReport:false},
            {id:'multi-goods',title:'顾客购买多件商品（6件及以上）',risk:'low',tags:['主动服务','多件商品','防漏付'],keywords:['多件','好多','一堆','六大件'],criteria:'顾客购买商品数量达6件及以上',flow:[{step:'主动提醒顾客逐件扫码'},{step:'利用利己心理引导'}],scripts:[{label:'提醒话术',text:'为了避免您多付，请您一件一件扫码加购，核对好数量后，再进行付款。'}],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        },
        {
          id: 'ai-shift',
          name: '交接班流程',
          icon: '🔄',
          desc: '上线准备、下班交接、班次切换',
          scenarios: [
            {id:'ai-pre-shift',title:'上线前准备',risk:'low',tags:['AI操作','上线'],keywords:['上线','准备','登录'],criteria:'开始值守前',flow:[{step:'检查设备：鼠标、耳机、键盘、主副屏、主机、摄像头'},{step:'打开四个软件：企业微信、谷歌浏览器、PhotoBooth、AI值守工作台'},{step:'调整摄像头角度，保持人物居中，微笑服务'},{step:'调整系统输入音量至最大'},{step:'确认大屏为主显示器'},{step:'登录 AI 值守工作台账号'},{step:'登录客服后台账号'},{step:'按 F 键唤起界面，点击"下班"切换为在线状态'},{step:'首次上线需录制语音包'}],scripts:[],transferCondition:'无需转人工',notes:'语音包录制：环境安静后录制，每人仅有十次机会，声音不低于20秒',needReport:false},
            {id:'ai-shift-end',title:'下班/休息店铺交接',risk:'low',tags:['AI操作','交接','下班'],keywords:['下班','挂起','排休','交接'],criteria:'需要下班或休息',flow:[{step:'按 F 键唤起控制台'},{step:'点击"下班"/"排休"/"挂起"对应按钮'},{step:'系统停止分配新店铺，处理完当前所有店铺后方可离席'},{step:'值班店长转交的店铺：商家在店/店内休息均可直接释放'},{step:'系统分配的店铺：无异常按常规流程，有异常转二线'}],scripts:[],transferCondition:'无需转人工',notes:'点击下班后系统只停止分配，必须将屏幕上所有店铺处理完毕才能离席',needReport:false},
            {id:'ai-false-alarm',title:'AI 识别异常-误报处理',risk:'low',tags:['AI操作','误报'],keywords:['误报','识别错误','标红'],criteria:'系统标红但实际无异常',flow:[{step:'查看工作台左上角异常描述'},{step:'结合监控画面判断是否真实异常'},{step:'确认为误报后点击"误报"按键'},{step:'按常规流程继续值守'}],scripts:[],transferCondition:'确认真实异常则转二线',notes:'误报按键仅在系统识别异常后出现，点击后按常规流程值守',needReport:false},
            {id:'direct-transfer',title:'转交二线流程',risk:'high',tags:['直接转交','高风险'],keywords:['偷盗','少付','多付','骑手','制服','醉酒','投诉','媒体','着火','损坏'],criteria:'高风险、紧急/敏感情况',flow:[{step:'识别高风险场景'},{step:'复制店铺信息'},{step:'备注情况（选择对应标签+文字说明）'},{step:'转交二线值班店长'},{step:'高风险事件必须上报班长'}],scripts:[{label:'统一话术',text:'这边为您转接专员处理，请您稍等。'}],transferCondition:'立即转二线+上报班长',notes:'人身安全/财产安全/舆情/偷盗完成备注转人工后，必须上报班长',needReport:true},
            {id:'transfer-fail',title:'转人工失败处理',risk:'mid',tags:['转人工','失败处理'],keywords:['转人工失败','无法转接'],criteria:'点击转人工后失败',flow:[{step:'需补标的（偷盗/少付/漏付/多付）：提供店铺ID+事件+时间+顾客手机号上报班长'},{step:'其他转人工失败：记录信息，上报班长处理'}],scripts:[],transferCondition:'上报班长',notes:'',needReport:true}
          ]
        },
        {
          id: 'ai-scripts',
          name: '话术参考',
          icon: '💬',
          desc: 'AI 值守常用标准话术',
          scenarios: [
            {id:'greeting-basic',title:'基础问候话术',risk:'low',tags:['话术','问候'],keywords:['你好','欢迎','问候'],criteria:'顾客进店',flow:[{step:'及时问候'},{step:'询问需求'}],scripts:[{label:'标准问候',text:'您好，欢迎光临，请问有什么可以帮您？'},{label:'简洁问候',text:'您好，有什么可以帮您？'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'apology-basic',title:'基础致歉话术',risk:'low',tags:['话术','致歉'],keywords:['抱歉','对不起','不好意思'],criteria:'需要致歉',flow:[{step:'诚恳致歉'},{step:'说明原因'},{step:'提供解决方案'}],scripts:[{label:'标准致歉',text:'实在抱歉给您带来不便，我们会尽快处理。'},{label:'深度致歉',text:'非常抱歉，这是我们的疏忽，我们会立即为您解决。'}],transferCondition:'顾客不满意转二线',notes:'',needReport:false},
            {id:'complaint-handling',title:'投诉处理话术',risk:'mid',tags:['话术','投诉'],keywords:['投诉','不满','差评'],criteria:'顾客投诉',flow:[{step:'耐心倾听'},{step:'表示理解'},{step:'致歉并说明处理方案'},{step:'跟进处理'}],scripts:[{label:'安抚话术',text:'非常理解您的心情，给您带来不好的体验我们深表歉意，我们会认真处理您的问题。'}],transferCondition:'严重投诉立即上报',notes:'',needReport:true}
          ]
        }
      ]
    },
    {
      id: 'store-manager',
      name: '值班店长专区',
      icon: '🏪',
      color: 'warning',
      desc: '值班店长岗位专用：到店处理、顾客接待、商品管理',
      categories: [
        {
          id: 'sm-risk',
          name: '异常与风险',
          icon: '🚨',
          desc: '到店处置偷盗、安全事件上报',
          scenarios: [
            {id:'sm-theft',title:'到店处置偷盗',risk:'high',tags:['偷盗','到店处置'],keywords:['偷盗','盗抢','夹带'],criteria:'AI值守转交偷盗事件需到店处理',flow:[{step:'接收AI值守转交信息'},{step:'到店核实情况'},{step:'与顾客沟通处理'},{step:'上报班长并记录'}],scripts:[],transferCondition:'无法处理立即上报班长',notes:'到店前先查看监控录像了解情况',needReport:true},
            {id:'sm-safety',title:'安全事件处置',risk:'high',tags:['安全','紧急'],keywords:['着火','受伤','打架','紧急'],criteria:'店内发生安全事件',flow:[{step:'评估现场情况'},{step:'必要时拨打110/120'},{step:'上报班长'},{step:'保留现场证据'}],scripts:[],transferCondition:'立即上报班长',notes:'人身安全优先，不要单独处置危险情况',needReport:true}
          ]
        },
        {
          id: 'sm-reception',
          name: '顾客接待',
          icon: '💬',
          desc: '日常服务、开门、问价、商品指引',
          scenarios: [
            {id:'ask-person',title:'顾客询问店里是否有人',risk:'low',tags:['被动服务','常规'],keywords:['有人吗','有没有人','在吗'],criteria:'顾客呼叫或发出询问',flow:[{step:'及时响应，3秒内回复'},{step:'使用标准话术回应'}],scripts:[{label:'标准话术',text:'请问有什么可以帮您？'}],transferCondition:'无需转人工',notes:'响应时间控制在3秒内',needReport:false},
            {id:'ask-price',title:'顾客询问商品价格',risk:'low',tags:['被动服务','价格查询'],keywords:['多少钱','价格','价钱','怎么卖'],criteria:'顾客询问价格',flow:[{step:'引导顾客扫码查看价格'}],scripts:[{label:'标准话术',text:'请将商品条形码对准扫码盒扫描即可看到价格。'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'ask-location',title:'顾客询问商品位置',risk:'low',tags:['被动服务','商品指引'],keywords:['在哪','在哪里','哪个区','找不到'],criteria:'顾客找不到商品',flow:[{step:'引导大致范围查找'},{step:'若未找到则致歉'},{step:'引导选购替代商品'}],scripts:[{label:'引导话术',text:'请您移步至XX用品区查看是否有您需要的商品。'},{label:'致歉话术',text:'实在抱歉，此类商品可能已经售空，您可以看一下店内是否有其他商品可以替代。'}],transferCondition:'药店询问商品位置需转交二线协助查询',notes:'',needReport:false},
            {id:'open-door',title:'协助顾客开门离店',risk:'low',tags:['主动服务','开门'],keywords:['开门','出不去','门打不开','离店'],criteria:'顾客无法正常离店',flow:[{step:'确认顾客购物流程无异常'},{step:'按O键远程开门'},{step:'引导顾客离店'}],scripts:[{label:'开门话术',text:'门已经帮您打开了，请携带好您的随身物品离店，期待您的下次光临。'}],transferCondition:'无需转人工',notes:'严禁将店外人员放入',needReport:false}
          ]
        },
        {
          id: 'sm-product',
          name: '商品与支付',
          icon: '📦',
          desc: '条码问题、售后退款、支付异常',
          scenarios: [
            {id:'no-barcode-product',title:'商品无条形码',risk:'low',tags:['商品问题','无码'],keywords:['无码','没条码','散装'],criteria:'商品本身无条形码',flow:[{step:'引导更换其他有条码商品代替'},{step:'顾客不配合则转交二线'}],scripts:[{label:'话术',text:'这件商品还没有入库，暂时无法购买，麻烦您更换其他商品。'}],transferCondition:'顾客不配合则转二线',notes:'',needReport:false},
            {id:'pos-breakdown',title:'POS机无法使用',risk:'mid',tags:['设备故障'],keywords:['pos机','不能用','黑屏'],criteria:'POS机故障',flow:[{step:'引导使用小程序付款'},{step:'引导重启POS机'}],scripts:[{label:'小程序',text:'您下拉微信聊天界面，打开【微店加加】小程序点击扫码购物即可。'}],transferCondition:'重启无效则上报班长',notes:'',needReport:false},
            {id:'overpay',title:'多付/重复支付',risk:'mid',tags:['资金风险'],keywords:['多付','重复付','付了两次'],criteria:'支付金额超出应付',flow:[{step:'备注事件'},{step:'联系商家退款'}],scripts:[],transferCondition:'无法处理转二线',notes:'',needReport:false}
          ]
        },
        {
          id: 'sm-open-close',
          name: '开关店流程',
          icon: '🔑',
          desc: '开店前检查、关店操作规范',
          scenarios: [
            {id:'sm-open',title:'开店前检查流程',risk:'low',tags:['开店','检查'],keywords:['开店','开门','检查'],criteria:'每日开店前',flow:[{step:'检查店内设备是否正常（POS机、扫码盒、门禁）'},{step:'检查商品陈列是否整齐'},{step:'确认监控画面正常'},{step:'登录值班系统，更新在线状态'}],scripts:[],transferCondition:'设备异常立即上报',notes:'',needReport:false},
            {id:'sm-close',title:'关店操作流程',risk:'low',tags:['关店','交接'],keywords:['关店','关门','下班'],criteria:'每日关店时',flow:[{step:'确认店内无顾客'},{step:'检查设备关闭状态'},{step:'锁门并确认门禁正常'},{step:'完成交接记录'}],scripts:[],transferCondition:'无需转人工',notes:'关店前务必确认店内无人',needReport:false}
          ]
        },
        {
          id: 'sm-scripts',
          name: '话术参考',
          icon: '💬',
          desc: '值班店长常用标准话术',
          scenarios: [
            {id:'guidance-payment',title:'支付引导话术',risk:'low',tags:['话术','支付'],keywords:['支付','付款','扫码'],criteria:'顾客询问支付',flow:[{step:'说明支付流程'}],scripts:[{label:'完整引导',text:'请您移步至收银台，将商品条形码对准扫码盒加购，加购完商品后，出示付款码对准扫码盒支付即可。'},{label:'简化引导',text:'请到收银台扫码加购后，出示付款码支付。'}],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        }
      ]
    },
    {
      id: 'system-devices',
      name: '系统与设备',
      icon: '🛠️',
      color: 'default',
      desc: '后台系统操作、设备故障处理、自身设备问题',
      categories: [
        {
          id: 'sys-ai',
          name: 'AI值守后台及工作台',
          icon: '🤖',
          desc: 'AI值守系统登录、操作、常见问题',
          scenarios: [
            {id:'ai-system-assign',title:'系统分配-AI识别无异常',risk:'low',tags:['AI操作','系统分配'],keywords:['系统分配','无异常','自动分配'],criteria:'AI agent初判无异常，系统分配给客服',flow:[{step:'接收系统分配店铺'},{step:'查看AI识别结果'},{step:'无异常则按常规流程值守'},{step:'发现异常则及时介入或转二线'}],scripts:[],transferCondition:'发现异常立即处理',notes:'AI识别结果为异常时工作台即时标红预警，需优先介入',needReport:false},
            {id:'pos-operation',title:'AI工作台操作指南',risk:'low',tags:['工具','工作台'],keywords:['工作台','操作','登录'],criteria:'工作台使用',flow:[{step:'登录AI值守工作台账号'},{step:'按F键唤起控制台'},{step:'查看店铺分配列表'},{step:'处理异常标红店铺'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        },
        {
          id: 'sys-manager',
          name: '值班店长工作台/后台',
          icon: '🏪',
          desc: '值班店长系统操作、后台管理',
          scenarios: [
            {id:'monitor-system',title:'监控系统使用',risk:'low',tags:['工具','监控'],keywords:['监控','摄像头','画面'],criteria:'查看监控',flow:[{step:'登录监控系统'},{step:'切换摄像头视角'},{step:'回放录像'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'service-standards',title:'值班店长后台操作',risk:'low',tags:['规范','后台'],keywords:['后台','系统','操作'],criteria:'后台日常操作',flow:[{step:'登录值班店长后台'},{step:'查看当前值守店铺列表'},{step:'处理待办事项'},{step:'记录交接信息'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        },
        {
          id: 'sys-store-device',
          name: '店铺设备故障',
          icon: '🔧',
          desc: 'POS机、扫码盒、门禁等店铺设备问题',
          scenarios: [
            {id:'door-not-open',title:'门无法打开/系统故障',risk:'mid',tags:['设备故障'],keywords:['门打不开','系统故障','卡住了'],criteria:'门禁系统故障',flow:[{step:'尝试按O键开门'},{step:'无效则转二线+上报班长'}],scripts:[],transferCondition:'无效立即转二线',notes:'',needReport:false},
            {id:'fridge-open',title:'冰箱门未关',risk:'low',tags:['主动服务','设备'],keywords:['冰箱','冰柜','门没关','开着'],criteria:'监控发现冰箱门未关',flow:[{step:'店内有顾客：提醒顾客关好冰箱门'},{step:'店内无顾客：转交二线处理'}],scripts:[{label:'提醒话术',text:'辛苦您将店内的冰箱门关好，感谢您的配合。'}],transferCondition:'无顾客时转二线',notes:'',needReport:false}
          ]
        },
        {
          id: 'sys-own-device',
          name: '自身设备问题',
          icon: '💻',
          desc: '值守人员自己的电脑、网络、登录异常',
          scenarios: [
            {id:'own-pc-issue',title:'电脑故障处理',risk:'mid',tags:['自身设备','电脑'],keywords:['电脑','死机','蓝屏','重启'],criteria:'值守电脑出现故障',flow:[{step:'尝试重启电脑'},{step:'重启后重新登录所有系统'},{step:'检查是否有遗漏的店铺未处理'},{step:'上报班长说明中断时间'}],scripts:[],transferCondition:'无法恢复立即上报班长',notes:'重启后务必检查是否有未处理的异常店铺',needReport:true},
            {id:'own-network-issue',title:'网络异常处理',risk:'mid',tags:['自身设备','网络'],keywords:['断网','网络','连不上','掉线'],criteria:'网络连接异常',flow:[{step:'检查网线/WiFi连接'},{step:'重启路由器'},{step:'使用手机热点临时替代'},{step:'上报班长'}],scripts:[],transferCondition:'无法恢复立即上报班长',notes:'',needReport:true},
            {id:'own-shortcut',title:'常用快捷键/操作技巧',risk:'low',tags:['技巧','快捷键'],keywords:['快捷键','操作','技巧'],criteria:'日常操作提效',flow:[{step:'O键：远程开门'},{step:'L键：远程锁门'},{step:'F键：唤起AI工作台控制台'},{step:'复制店铺信息：右键店铺名称'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        }
      ]
    },
    {
      id: 'training-standards',
      name: '培训与规范',
      icon: '📚',
      color: 'success',
      desc: '新人培训、话术库、案例复盘、考核标准',
      categories: [
        {
          id: 'tr-onboarding',
          name: '新人培训须知',
          icon: '🎓',
          desc: '新员工入职培训内容与注意事项',
          scenarios: [
            {id:'onboarding-guide',title:'新人入职指南',risk:'low',tags:['培训','入职'],keywords:['新人','入职','培训'],criteria:'新员工入职',flow:[{step:'了解公司文化与岗位职责'},{step:'学习基础操作流程'},{step:'熟悉工作台与系统'},{step:'实操练习与考核'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'basic-skills',title:'基础技能培训',risk:'low',tags:['培训','技能'],keywords:['技能','学习','培训'],criteria:'技能培训',flow:[{step:'学习理论知识'},{step:'观看操作演示'},{step:'实际操作练习'},{step:'考核评估'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        },
        {
          id: 'tr-scripts',
          name: '标准话术库',
          icon: '💬',
          desc: '各类场景通用标准话术',
          scenarios: [
            {id:'greeting-basic-tr',title:'基础问候话术',risk:'low',tags:['话术','问候'],keywords:['你好','欢迎','问候'],criteria:'顾客进店',flow:[{step:'及时问候'},{step:'询问需求'}],scripts:[{label:'标准问候',text:'您好，欢迎光临，请问有什么可以帮您？'},{label:'简洁问候',text:'您好，有什么可以帮您？'}],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'apology-basic-tr',title:'基础致歉话术',risk:'low',tags:['话术','致歉'],keywords:['抱歉','对不起','不好意思'],criteria:'需要致歉',flow:[{step:'诚恳致歉'},{step:'说明原因'},{step:'提供解决方案'}],scripts:[{label:'标准致歉',text:'实在抱歉给您带来不便，我们会尽快处理。'},{label:'深度致歉',text:'非常抱歉，这是我们的疏忽，我们会立即为您解决。'}],transferCondition:'顾客不满意转二线',notes:'',needReport:false},
            {id:'complaint-handling-tr',title:'投诉处理话术',risk:'mid',tags:['话术','投诉'],keywords:['投诉','不满','差评'],criteria:'顾客投诉',flow:[{step:'耐心倾听'},{step:'表示理解'},{step:'致歉并说明处理方案'}],scripts:[{label:'安抚话术',text:'非常理解您的心情，给您带来不好的体验我们深表歉意，我们会认真处理您的问题。'}],transferCondition:'严重投诉立即上报',notes:'',needReport:true}
          ]
        },
        {
          id: 'tr-cases',
          name: '典型案例复盘',
          icon: '📊',
          desc: '偷盗、投诉、优秀服务案例分析',
          scenarios: [
            {id:'case-theft',title:'偷盗案例分析',risk:'high',tags:['案例','偷盗'],keywords:['偷盗','案例','分析'],criteria:'偷盗事件复盘',flow:[{step:'回顾事件经过'},{step:'分析处理过程'},{step:'总结经验教训'},{step:'提出改进措施'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'case-complaint',title:'投诉处理案例',risk:'mid',tags:['案例','投诉'],keywords:['投诉','案例','处理'],criteria:'投诉事件复盘',flow:[{step:'回顾投诉内容'},{step:'分析处理方式'},{step:'总结沟通技巧'},{step:'优化服务流程'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false},
            {id:'excellent-service',title:'优质服务案例',risk:'low',tags:['案例','优秀'],keywords:['优秀','服务','案例'],criteria:'优秀服务复盘',flow:[{step:'分享服务过程'},{step:'总结��功要点'},{step:'推广优秀经验'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        },
        {
          id: 'tr-standards',
          name: '操作规范',
          icon: '📐',
          desc: '值守操作标准与注意事项',
          scenarios: [
            {id:'security-standards',title:'安全操作规范',risk:'mid',tags:['规范','安全'],keywords:['安全','规范','注意'],criteria:'涉及安全操作',flow:[{step:'评估风险等级'},{step:'按规范操作'},{step:'必要时上报'}],scripts:[],transferCondition:'高风险立即上报',notes:'',needReport:false},
            {id:'communication-skills',title:'沟通技巧提升',risk:'low',tags:['学习','沟通'],keywords:['沟通','技巧','提升'],criteria:'沟通能力提升',flow:[{step:'学习沟通理论'},{step:'分析案例'},{step:'模拟练习'},{step:'实战应用'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        },
        {
          id: 'tr-exam',
          name: '考核标准',
          icon: '✅',
          desc: '新人考核要求与通过标准',
          scenarios: [
            {id:'exam-standard',title:'新人考核标准',risk:'low',tags:['考核','标准'],keywords:['考核','通过','标准','测试'],criteria:'新人考核',flow:[{step:'理论知识测试'},{step:'实操演练考核'},{step:'话术模拟考核'},{step:'综合评分'}],scripts:[],transferCondition:'无需转人工',notes:'',needReport:false}
          ]
        },
        {
          id: 'tr-escalation',
          name: '紧急联系/上报流程',
          icon: '📞',
          desc: '遇到大事找谁、上报流程规范',
          scenarios: [
            {id:'escalation-flow',title:'紧急上报流程',risk:'high',tags:['上报','紧急'],keywords:['上报','班长','紧急','联系'],criteria:'遇到需要上报的情况',flow:[{step:'判断事件等级'},{step:'第一时间联系班长'},{step:'提供：店铺ID+事件描述+时间+顾客信息'},{step:'等待班长指示并配合处理'}],scripts:[{label:'上报格式',text:'店铺ID：XXX | 事件：XXX | 时间：XX:XX | 情况说明：XXX'}],transferCondition:'无需转人工',notes:'偷盗/少付/人身安全/舆情必须上报',needReport:true}
          ]
        }
      ]
    }
  ]
};

const ADMIN_CONFIG = {
  passwordHash: 'd2VpZGlhbjI0YWRtaW4='
};
