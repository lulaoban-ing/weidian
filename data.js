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
          id: 'ai-preparation',
          name: '工作准备',
          icon: '⚙️',
          desc: '上线前设备检查、软件登录、语音包录制、下班操作',
          scenarios: [
            {id:'prep-device',title:'上线前设备检查',risk:'low',tags:['设备','准备'],keywords:['设备','检查','鼠标','耳机','键盘','摄像头'],criteria:'每次上线前必须检查',flow:[{step:'检查鼠标/耳机/键盘/摄像头是否完整'},{step:'检查主副屏配置是否正确'},{step:'确认大屏为主显示器'}],scripts:[],transferCondition:'设备故障联系技术支持',notes:'设备完整性直接影响工作质量',needReport:false},
            {id:'prep-camera',title:'调整摄像头角度',risk:'low',tags:['设备','准备'],keywords:['摄像头','角度','居中','微笑'],criteria:'上线前调整',flow:[{step:'打开Photo Booth查看画面'},{step:'调整摄像头保持人物居中'},{step:'保持微笑服务状态'}],scripts:[],transferCondition:'无',notes:'摄像头画面会展示给顾客，需保持专业形象',needReport:false},
            {id:'prep-microphone',title:'调整麦克风音量',risk:'low',tags:['设备','准备'],keywords:['麦克风','音量','输入'],criteria:'上线前调整',flow:[{step:'打开系统设置-声音'},{step:'点击输入，选择对应耳机/麦克风'},{step:'将输入音量拉到最大'}],scripts:[],transferCondition:'无',notes:'音量过小会导致顾客听不清',needReport:false},
            {id:'prep-login',title:'软件登录',risk:'low',tags:['软件','准备'],keywords:['登录','工作台','后台'],criteria:'上线前登录',flow:[{step:'登录AI值守工作台'},{step:'登录客服后台'},{step:'确认账号密码正确'}],scripts:[],transferCondition:'登录失败联系技术支持',notes:'两个系统都需要登录',needReport:false},
            {id:'prep-voice',title:'语音包录制',risk:'mid',tags:['语音','准备'],keywords:['语音包','录制','提交'],criteria:'首次上线必须录制',flow:[{step:'在上线界面点击复制链接'},{step:'使用企业微信连接公司内网'},{step:'按提示录制语音包'},{step:'试听确认无误后提交'}],scripts:[],transferCondition:'录制失败联系培训老师',notes:'只有10次录制机会，环境必须安静，声音不能低于20秒',needReport:false},
            {id:'prep-offline',title:'下班/挂起/排休操作',risk:'low',tags:['操作','流程'],keywords:['下班','挂起','排休','离席'],criteria:'下班或临时离开时操作',flow:[{step:'按F键唤起控制台'},{step:'点击对应按钮（下班/挂起/排休）'},{step:'等待当前所有店铺接待完毕'},{step:'确认状态切换后方可离席'}],scripts:[],transferCondition:'无',notes:'点击后系统停止分配新店铺，但需处理完当前店铺',needReport:false}
          ]
        },
        {
          id: 'ai-assignment',
          name: '分配场景处理',
          icon: '📋',
          desc: '二线转交场景、系统分配场景的处理流程',
          scenarios: [
            {id:'assign-merchant',title:'二线转交：商家/店员在店',risk:'low',tags:['转交','低风险'],keywords:['商家','店员','在店','已核实'],criteria:'二线已核实身份的商家/店员在店',flow:[{step:'接管持续看守'},{step:'商家/店员提出需求时及时响应'},{step:'商家/店员离店后释放店铺'}],scripts:[{label:'商家提问',text:'您可在微店24APP内反馈一下会有专业人员帮您处理或拨打店门上张贴的400官方电话反馈'}],transferCondition:'无',notes:'已核实身份属于可信人员，低风险场景',needReport:false},
            {id:'assign-rest',title:'二线转交：店内滞留/休息人群',risk:'low',tags:['转交','低风险'],keywords:['滞留','休息','休息区'],criteria:'商家允许顾客休息且店内设有休息区',flow:[{step:'接管持续看守'},{step:'监控休息区动态'},{step:'顾客有需求时及时响应'}],scripts:[{label:'询问',text:'请问有什么可以帮到您的？'}],transferCondition:'无',notes:'正常经营范围内的非购物滞留',needReport:false},
            {id:'assign-abnormal',title:'系统分配-AI识别异常',risk:'high',tags:['系统分配','异常'],keywords:['标红','预警','异常','误报'],criteria:'AI识别结果为异常，工作台标红预警',flow:[{step:'紧急识别异常做出判断'},{step:'确认异常-转接二线客服'},{step:'确认无异常-点击"误报"按钮'},{step:'按常规流程正常值守'}],scripts:[],transferCondition:'确认异常立即转二线',notes:'AI可能误报，需人工二次判断',needReport:false},
            {id:'assign-normal',title:'系统分配-AI识别无异常',risk:'low',tags:['系统分配','正常'],keywords:['无异常','正常值守','常规'],criteria:'AI识别结果为无异常',flow:[{step:'按常规流程正常接待'},{step:'根据场景选择介入方式'}],scripts:[],transferCondition:'发现异常转二线',notes:'分为完全介入、部分介入、直接转交三种情况',needReport:false}
          ]
        },
        {
          id: 'ai-intervention',
          name: '客服介入判断',
          icon: '🎯',
          desc: '完全介入、部分介入、直接转交的场景分类',
          scenarios: [
            {id:'inter-full-ask',title:'完全介入：询问是否有人',risk:'low',tags:['完全介入','被动服务'],keywords:['有人吗','在吗','有没有人'],criteria:'顾客询问店内是否有人',flow:[{step:'及时响应'}],scripts:[{label:'响应',text:'请问有什么可以帮您？'}],transferCondition:'无',notes:'',needReport:false},
            {id:'inter-full-identity',title:'完全介入：询问值班人员身份',risk:'low',tags:['完全介入','被动服务'],keywords:['谁在值守','真人吗','是机器人吗'],criteria:'顾客询问值班人员身份',flow:[{step:'及时响应'}],scripts:[{label:'响应',text:'是的，店铺都是真人在值守。'}],transferCondition:'无',notes:'',needReport:false},
            {id:'inter-full-payment',title:'完全介入：询问付款方式',risk:'low',tags:['完全介入','被动服务'],keywords:['怎么付款','如何支付','付款方式'],criteria:'顾客询问付款方式',flow:[{step:'支付引导'}],scripts:[{label:'引导',text:'请您移步至收银台，将商品条形码对准扫码盒加购，加购完商品后，出示付款码对准扫码盒支付即可。'}],transferCondition:'无',notes:'',needReport:false},
            {id:'inter-full-price',title:'完全介入：询问商品价格',risk:'low',tags:['完全介入','被动服务'],keywords:['多少钱','价格','怎么看价格'],criteria:'顾客询问商品价格',flow:[{step:'引导顾客扫描查看'}],scripts:[{label:'引导',text:'请将商品条形码对准扫码盒扫描即可看到价格。'}],transferCondition:'无',notes:'',needReport:false},
            {id:'inter-full-door',title:'完全介入：协助开门离店',risk:'low',tags:['完全介入','主动服务'],keywords:['开门','出不去','门打不开'],criteria:'确认顾客未购物或购物流程无异常',flow:[{step:'开门'},{step:'引导顾客离店'}],scripts:[{label:'开门',text:'门已经帮您打开了，请携带好您的随身物品离店，期待您的下次光临'}],transferCondition:'无',notes:'严禁反向操作将店外人员放入',needReport:false},
            {id:'inter-full-smoking',title:'完全介入：店内吸烟',risk:'mid',tags:['完全介入','主动服务'],keywords:['吸烟','抽烟','点烟'],criteria:'顾客在店内吸烟',flow:[{step:'及时介入制止'}],scripts:[{label:'制止',text:'本店禁止吸烟，请您将香烟熄灭至店外，感谢您的配合'}],transferCondition:'顾客拒不配合转二线',notes:'',needReport:false},
            {id:'inter-full-check',title:'完全介入：核对商品数量',risk:'low',tags:['完全介入','主动服务'],keywords:['核对','几件','数量'],criteria:'顾客结算前核对商品',flow:[{step:'口头核实'},{step:'信任顾客'}],scripts:[{label:'核实',text:'请问您一共购买了几件商品？'}],transferCondition:'无',notes:'',needReport:false},
            {id:'inter-full-multi',title:'完全介入：购买多件商品',risk:'low',tags:['完全介入','主动服务'],keywords:['多件','很多','六件以上'],criteria:'顾客购买六件及以上商品',flow:[{step:'利用利己心理提醒'}],scripts:[{label:'提醒',text:'为了避免您多付，请您一件一件扫码加购，核对好数量后，再进行付款。'}],transferCondition:'无',notes:'',needReport:false},
            {id:'inter-full-stay',title:'完全介入：长时间在店',risk:'low',tags:['完全介入','主动服务'],keywords:['长时间','一直在','不走'],criteria:'顾客在店超过正常购物时长',flow:[{step:'询问诉求'}],scripts:[{label:'询问',text:'请问有什么可以帮到您的？'}],transferCondition:'顾客有特殊需求转二线',notes:'',needReport:false},
            {id:'inter-full-express',title:'完全介入：取快递/团购',risk:'low',tags:['完全介入','主动服务'],keywords:['快递','团购','取货'],criteria:'顾客进店取快递或团购商品',flow:[{step:'询问确认'}],scripts:[{label:'询问',text:'请问您是来取快递/团购商品的吗？'}],transferCondition:'无',notes:'',needReport:false},
            {id:'inter-full-child',title:'完全介入：携带儿童/宠物',risk:'low',tags:['完全介入','主动服务'],keywords:['小孩','儿童','宠物','狗','猫'],criteria:'顾客携带儿童或宠物进店',flow:[{step:'及时介入提醒'}],scripts:[{label:'儿童',text:'请您看顾好您的小朋友，避免磕伤碰伤'},{label:'宠物',text:'本店禁止宠物入内，请将宠物带离至店外'}],transferCondition:'无',notes:'',needReport:false},
            {id:'inter-part-location',title:'部分介入：询问商品位置',risk:'low',tags:['部分介入'],keywords:['在哪','找不到','商品位置'],criteria:'顾客找不到目标商品',flow:[{step:'引导大致范围'},{step:'顾客未找到-致歉'},{step:'引导选购其他商品替代'}],scripts:[{label:'引导',text:'请您移步至XX用品区查看是否有您需要的商品。'},{label:'致歉',text:'实在抱歉，此类商品可能已经售空，您可以看一下店内是否有其他商品可以替代，或等店主到店后再来购买'}],transferCondition:'药店询问位置需转二线',notes:'',needReport:false},
            {id:'inter-part-unpack',title:'部分介入：未支付商品拆封',risk:'mid',tags:['部分介入'],keywords:['拆封','拆包','打开'],criteria:'顾客未付款前拆开商品',flow:[{step:'立即介入提醒其付款'},{step:'顾客拒付或产生争议-备注转二线'}],scripts:[{label:'提醒',text:'请您先移步至收银台将商品扫码付款再进行使用。'},{label:'转交',text:'实在抱歉，客服帮您转接专员处理一下。'}],transferCondition:'顾客拒付转二线',notes:'',needReport:false},
            {id:'inter-part-prize',title:'部分介入：商品兑奖',risk:'low',tags:['部分介入'],keywords:['兑奖','中奖','红牛','槟榔'],criteria:'顾客持中奖商品要求兑换',flow:[{step:'致歉表示无法兑奖'},{step:'顾客不认可-备注转二线'}],scripts:[{label:'致歉',text:'实在抱歉，云值守期间暂不支持兑奖，请您等到店员在店的时再进行兑奖。'},{label:'转交',text:'实在抱歉，客服帮您转接专员处理一下。'}],transferCondition:'顾客不认可转二线',notes:'',needReport:false},
            {id:'inter-part-merchant',title:'部分介入：疑似商家/店员',risk:'mid',tags:['部分介入'],keywords:['商家','店员','老板'],criteria:'店内疑似商家或内部员工',flow:[{step:'初步识别'},{step:'转交二线核实身份'}],scripts:[{label:'询问',text:'请问您是商家/店员到店吗？'},{label:'引导',text:'请您在微店24APP反馈下，未避免多次核实，您可在微店24app内添加商家/店员手机号。帮您转接专员核实一下身份，请稍候。'}],transferCondition:'转二线核实',notes:'',needReport:false},
            {id:'inter-part-fridge',title:'部分介入：冰箱门未关',risk:'low',tags:['部分介入'],keywords:['冰箱','没关','门开着'],criteria:'店内冰箱门长时间未关闭',flow:[{step:'顾客在店-引导提醒'},{step:'未响应/店内无顾客-备注转二线'}],scripts:[{label:'提醒',text:'辛苦您将店内的冰箱门关好，感谢您的配合。'}],transferCondition:'无人响应转二线',notes:'',needReport:false},
            {id:'inter-direct-theft',title:'直接转交：偷盗',risk:'high',tags:['直接转交','资金安全'],keywords:['偷','盗','藏商品'],criteria:'发现偷盗行为',flow:[{step:'锁门'},{step:'复制店铺信息'},{step:'备注详情'},{step:'转交二线'},{step:'上报班长'}],scripts:[],transferCondition:'立即转二线+上报班长',notes:'店内小型偷盗需锁门，倚门盗抢不锁门',needReport:true},
            {id:'inter-direct-underpay',title:'直接转交：少付/漏付',risk:'high',tags:['直接转交','资金安全'],keywords:['少付','漏付','没付全'],criteria:'实际支付少于应付',flow:[{step:'锁门'},{step:'转交二线'}],scripts:[],transferCondition:'立即转二线+锁门',notes:'常发生在购买多件商品时',needReport:true},
            {id:'inter-direct-overpay',title:'直接转交：多付',risk:'mid',tags:['直接转交','资金安全'],keywords:['多付','重复支付','扣了两次'],criteria:'订单重复支付或商品重复扫码',flow:[{step:'备注信息'},{step:'转交二线'}],scripts:[],transferCondition:'转二线处理',notes:'',needReport:false},
            {id:'inter-direct-damage',title:'直接转交：商品破损',risk:'mid',tags:['直接转交'],keywords:['破损','打碎','弄坏'],criteria:'顾客因个人原因造成商品破损',flow:[{step:'锁门'},{step:'备注信息'},{step:'转交二线'}],scripts:[],transferCondition:'转二线处理',notes:'',needReport:false},
            {id:'inter-direct-bag',title:'直接转交：购物袋',risk:'low',tags:['直接转交'],keywords:['购物袋','袋子','塑料袋'],criteria:'涉及购物袋使用相关事件',flow:[{step:'确认需求'},{step:'转二线'}],scripts:[{label:'统一',text:'这边为您转接专员处理，请您稍等。'}],transferCondition:'转二线处理',notes:'',needReport:false},
            {id:'inter-direct-nocode',title:'直接转交：购买无码商品',risk:'mid',tags:['直接转交','顾客需求'],keywords:['无码','没有条码','扫不出来'],criteria:'散装称重/生鲜/未录入商品',flow:[{step:'确认需求'},{step:'转二线'}],scripts:[{label:'统一',text:'这边为您转接专员处理，请您稍等。'}],transferCondition:'转二线处理',notes:'',needReport:false},
            {id:'inter-direct-activity',title:'直接转交：询问店内活动',risk:'low',tags:['直接转交','顾客需求'],keywords:['活动','满减','赠品','积分'],criteria:'捆绑售卖/积分/金币/储值卡/满减/赠品',flow:[{step:'确认需求'},{step:'转二线'}],scripts:[{label:'统一',text:'这边为您转接专员处理，请您稍等。'}],transferCondition:'转二线处理',notes:'',needReport:false},
            {id:'inter-direct-device',title:'直接转交：使用店内设备',risk:'mid',tags:['直接转交','顾客需求'],keywords:['烧水壶','微波炉','设备'],criteria:'使用具有一定风险的设备设施',flow:[{step:'确认需求'},{step:'转二线'}],scripts:[{label:'统一',text:'这边为您转接专员处理，请您稍等。'}],transferCondition:'转二线处理',notes:'',needReport:false},
            {id:'inter-direct-nonpos',title:'直接转交：非POS机付款',risk:'mid',tags:['直接转交','顾客需求'],keywords:['扫商家码','收银机','转账','现金'],criteria:'扫描商家二维码/店内收银机/转账/现金支付',flow:[{step:'确认需求'},{step:'转二线'}],scripts:[{label:'统一',text:'这边为您转接专员处理，请您稍等。'}],transferCondition:'转二线处理',notes:'',needReport:false},
            {id:'inter-direct-feedback',title:'直接转交：二次进店反馈',risk:'mid',tags:['直接转交','顾客需求'],keywords:['上次','之前','没付款','多付了'],criteria:'上次进店未付款/多付款/商品有问题/更换商品',flow:[{step:'确认需求'},{step:'转二线'}],scripts:[{label:'统一',text:'这边为您转接专员处理，请您稍等。'}],transferCondition:'转二线处理',notes:'',needReport:false}
          ]
        },
        {
          id: 'ai-special',
          name: '特殊人群识别',
          icon: '👤',
          desc: '未成年购烟、骑手、制服人员、醉酒顾客的识别与处理',
          scenarios: [
            {id:'special-minor',title:'未成年购烟识别',risk:'high',tags:['特殊人群','合规'],keywords:['未成年','学生','买烟','香烟'],criteria:'疑似未成年人购买香烟',flow:[{step:'立即锁门（L键）'},{step:'转接人工'},{step:'情况备注'}],scripts:[{label:'统一话术',text:'云值守期间本店不向未成年人出售香烟。'}],transferCondition:'立即转二线',notes:'宁可错杀，不可放过！违法行为必须拦截',identifyTips:['穿着：校服/运动队服/背书包/携带课本/佩戴学生证','时间：上学时段（15-17点）/深夜独自逗留/多人同行','行为：眼神躲闪/不敢直视/说不出品牌名称/要求"最便宜的烟"','外貌：身高体型矮小瘦弱/面部稚嫩/皮肤细腻/有青春痘/未长胡须或胡须稀疏'],needReport:true},
            {id:'special-rider',title:'外卖骑手识别',risk:'low',tags:['特殊人群'],keywords:['骑手','外卖','美团','取货'],criteria:'外卖配送人员进店',flow:[{step:'主动询问来意'},{step:'个人购物-正常引导'},{step:'取货配送-备注转二线'}],scripts:[{label:'询问',text:'请问您是来购物还是取外卖订单？'}],transferCondition:'取货转二线',notes:'可通过观察行为或直接询问区分身份',needReport:false},
            {id:'special-uniform',title:'制服人员识别',risk:'high',tags:['特殊人群','执法'],keywords:['制服','执法','检查','工商','市场监管'],criteria:'穿着制服人员进店',flow:[{step:'主动询问来意'},{step:'个人购物-正常引导'},{step:'公务检查-优先表明真人身份'},{step:'立即转交人工+备注'}],scripts:[{label:'询问',text:'请问您是来购物还是有其他事项？'}],transferCondition:'公务检查立即转二线',notes:'执法、检查、市政等制服人员',needReport:false},
            {id:'special-drunk',title:'醉酒顾客处理',risk:'high',tags:['特殊人群','安全'],keywords:['醉酒','喝醉','闹事','冲突'],criteria:'顾客醉酒状态下言语冲突或破坏物品',flow:[{step:'备注情况'},{step:'转接二线'}],scripts:[],transferCondition:'立即转二线',notes:'',needReport:false},
            {id:'special-merchant-verify',title:'商家/店员身份核实',risk:'mid',tags:['特殊人群'],keywords:['商家','店员','老板','员工'],criteria:'非普通顾客身份人员进店',flow:[{step:'直接转接二线'},{step:'由二线核实身份'},{step:'核实后进行后续处理'}],scripts:[],transferCondition:'直接转二线核实',notes:'',needReport:false}
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
