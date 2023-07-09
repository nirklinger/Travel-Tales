import { NewActivitiesWithMedia } from '../../types/types';
import {
  deleteActivityAndMedia,
  insertNewActivity,
  searchCosineSimilarity,
  updateActivityById,
} from '../dal/activities';
import { Activities } from '../../types/db-schema-definitions';
import { embedActivities } from './embedding';
import { generateEmbeddings } from './open-ai';
import { classifyCategories } from '../dal/categories';

export const createNewActivity = async (newActivity: NewActivitiesWithMedia) => {
  const { media, ...activity } = newActivity;
  const activityId = await insertNewActivity(activity);
  return activityId;
};

export const updateActivity = async (id: number, changes: Partial<Omit<Activities, 'id'>>) => {
  if (changes.description || changes.name) {
    changes.should_embed = true;
  }

  const activityId = await updateActivityById(id, changes);

  return activityId;
};

export const deleteActivity = async (activityId: number) => {
  return deleteActivityAndMedia(activityId);
};

export const searchActivitiesBySemantics = async (search: string) => {
  const searchEmbeddings = [
    -0.0022650878,
    -0.0035970944,
    0.010980604,
    -0.027140483,
    -0.022542695,
    0.023894986,
    -0.012630399,
    -0.017674446,
    0.0037188008,
    -0.01444247,
    -0.014455993,
    0.024625223,
    -0.00070361403,
    0.0011443765,
    0.0047397804,
    -0.0013675045,
    0.022326328,
    -0.02279963,
    0.02902017,
    -0.008553241,
    -0.010013716,
    -0.003130554,
    0.0028600958,
    0.0026673945,
    0.013610811,
    -0.009114442,
    0.00093730685,
    -0.028479252,
    0.00072009506,
    0.010203037,
    0.020460166,
    0.009046828,
    -0.009614791,
    -0.013272738,
    -0.0125492625,
    -0.007714821,
    -0.02762731,
    -0.0029530658,
    -0.0016278205,
    -0.016646704,
    -0.000863776,
    -0.014280195,
    -0.002907426,
    -0.007620161,
    -0.012954949,
    -0.00027172602,
    0.037918244,
    -0.009979909,
    -0.016795456,
    0.0066803186,
    0.020865854,
    0.0056120083,
    -0.03743142,
    -0.039405767,
    -0.010622247,
    0.014915772,
    -0.014280195,
    0.006984584,
    0.0053516924,
    0.006720887,
    -0.008154316,
    -0.0003429326,
    -0.028127657,
    0.013198362,
    -0.0034162255,
    -0.0119204465,
    -0.020257322,
    0.0041921027,
    -0.0006854426,
    0.011338961,
    0.034672745,
    0.02020323,
    -0.0039182636,
    -0.021541998,
    0.0014030021,
    0.007775674,
    -0.00510828,
    -0.016132833,
    0.00343651,
    0.00069516216,
    0.016741365,
    -0.011683796,
    0.001889827,
    0.028019473,
    0.007194189,
    -0.013238931,
    -0.014496561,
    0.02484159,
    -0.009824395,
    -0.015686577,
    0.0074714087,
    0.0112578245,
    0.017255235,
    -0.001615988,
    -0.03599799,
    0.00082827837,
    0.03069701,
    0.03570049,
    0.026018083,
    -0.008931884,
    -0.008695233,
    -0.010230083,
    0.009357855,
    -0.013462059,
    -0.011203732,
    -0.024598178,
    0.0111564025,
    -0.0057134302,
    0.027640833,
    0.011555328,
    -0.019621745,
    0.017715015,
    -0.005415926,
    -0.04081215,
    -0.013367399,
    -0.019229582,
    -0.002596399,
    0.009019782,
    -0.021947686,
    -0.0152673675,
    0.007890619,
    0.023245886,
    0.009608028,
    -0.017201144,
    0.017755583,
    0.026045129,
    -0.011859594,
    -0.023435207,
    -0.009479561,
    0.014361332,
    0.04735724,
    0.007883858,
    0.027140483,
    -0.018553436,
    -0.0070927674,
    0.034835022,
    -0.030102002,
    -0.000013588941,
    -0.016268063,
    -0.012380226,
    -0.0019016595,
    0.025558304,
    -0.008411251,
    0.0033672052,
    0.012826482,
    0.027519125,
    -0.013901553,
    0.010331505,
    0.0015399216,
    -0.02321884,
    0.03115679,
    -0.03561935,
    0.010223322,
    0.024408856,
    -0.0010894396,
    0.016822502,
    0.01110231,
    0.030913377,
    -0.014144965,
    -0.011724365,
    0.0054226876,
    0.0035125765,
    0.0046518818,
    -0.021812458,
    0.00887103,
    0.023421684,
    0.011562089,
    0.00012096667,
    -0.000114733455,
    -0.01802604,
    0.011717604,
    0.036376633,
    -0.0027147245,
    0.024043737,
    -0.023773279,
    0.03826984,
    -0.005206321,
    0.0052266056,
    -0.018756278,
    -0.023786802,
    -0.027992427,
    0.010656054,
    0.033077043,
    0.02075767,
    -0.0131780775,
    -0.010466734,
    0.01421258,
    -0.016011128,
    -0.0038979794,
    -0.015348505,
    -0.003176194,
    0.007133336,
    0.016497953,
    0.007863573,
    -0.64607066,
    -0.031292018,
    0.006041361,
    0.017769106,
    0.009432231,
    0.026153311,
    0.017160576,
    -0.0094727995,
    0.004198864,
    -0.011548567,
    -0.023786802,
    0.008167839,
    -0.0022177575,
    -0.006349007,
    0.0035869523,
    -0.008235454,
    -0.013773086,
    0.0072753266,
    -0.021907117,
    0.010189514,
    -0.031643614,
    0.011622943,
    0.0015593608,
    0.012853527,
    0.030751102,
    -0.0028110754,
    0.015118616,
    -0.049331583,
    -0.034023646,
    0.0017478364,
    -0.019635268,
    0.025707055,
    -0.00055570714,
    -0.012339657,
    0.05141411,
    -0.048655435,
    -0.009716212,
    0.008025848,
    0.010541109,
    0.057012595,
    -0.0027654355,
    0.008296306,
    0.02902017,
    0.003441581,
    -0.009513369,
    -0.0070521985,
    0.026261495,
    -0.025720578,
    0.010088093,
    -0.02289429,
    0.038242795,
    0.010432927,
    0.0058114715,
    0.0013286261,
    -0.015145661,
    -0.008424774,
    0.017065914,
    -0.01240051,
    -0.0050136195,
    0.017958427,
    -0.0028567151,
    0.0018120701,
    0.00041096975,
    -0.016132833,
    0.010946797,
    0.023773279,
    -0.01281972,
    0.006484236,
    0.022637354,
    -0.018932076,
    0.00040272923,
    0.0114606675,
    -0.025017386,
    0.002429053,
    0.022123484,
    0.013211885,
    0.02484159,
    -0.02075767,
    -0.004100823,
    0.0131780775,
    0.00441185,
    0.0035565258,
    -0.020717101,
    -0.009506607,
    0.02457113,
    -0.0055883434,
    -0.029479949,
    -0.003056178,
    0.018539913,
    -0.00055486197,
    0.008830462,
    0.0010023859,
    -0.0037695116,
    0.011244302,
    0.013502628,
    0.025707055,
    -0.011906924,
    0.0074105556,
    0.014739974,
    -0.0176474,
    0.0013201743,
    0.014199058,
    0.002920949,
    0.0019760355,
    0.033239316,
    -0.009973148,
    -0.005818233,
    -0.023340546,
    0.017620355,
    -0.048087474,
    0.016173402,
    -0.010953559,
    -0.028100612,
    -0.0058858474,
    0.005047427,
    -0.031968165,
    -0.011379531,
    0.0057506184,
    0.008073178,
    -0.012434318,
    0.008242215,
    -0.017863767,
    0.013171316,
    0.0036647092,
    0.003955452,
    0.016051697,
    0.01165675,
    -0.037647787,
    0.0077351057,
    -0.008810177,
    0.01802604,
    0.009574221,
    0.033293407,
    -0.016890116,
    0.012806198,
    -0.011379531,
    0.012772391,
    -0.010703385,
    0.01476702,
    -0.028506298,
    -0.027370373,
    -0.004002782,
    -0.020649487,
    0.014699405,
    0.0070792446,
    -0.041677613,
    -0.036647093,
    -0.0021670465,
    -0.017295804,
    0.006913589,
    -0.02075767,
    -0.013536435,
    -0.0080123255,
    -0.011318677,
    -0.004425373,
    -0.0013827177,
    0.0038540298,
    -0.014361332,
    -0.02596399,
    -0.014712928,
    0.0049730507,
    0.010317982,
    -0.02999382,
    -0.0021704275,
    0.003032513,
    -0.008370683,
    -0.006545089,
    0.00854648,
    -0.0011215565,
    -0.02791129,
    0.007322657,
    0.0038472684,
    -0.0019912487,
    0.021339156,
    -0.0026352773,
    0.006538328,
    0.0030172998,
    -0.019148443,
    -0.012664207,
    0.0070048682,
    0.014374855,
    -0.0035328607,
    -0.013509389,
    0.009837918,
    0.020311413,
    0.014253149,
    -0.016660227,
    0.01839116,
    -0.022177575,
    0.010885944,
    -0.0035599065,
    0.01147419,
    0.0025389267,
    0.009594506,
    0.0039486904,
    -0.004323951,
    -0.019621745,
    0.020784715,
    0.018120702,
    0.0138745075,
    0.008255738,
    0.002442576,
    0.018539913,
    -0.0040095435,
    0.0021771889,
    -0.008485627,
    0.0064673326,
    -0.0055849627,
    0.004638359,
    0.008925122,
    0.004476084,
    -0.014631791,
    -0.041298974,
    -0.020784715,
    0.033861373,
    0.035213664,
    0.008505912,
    0.004607932,
    -0.010919752,
    -0.032563172,
    0.0057303337,
    -0.009919056,
    0.00016449354,
    -0.020595394,
    0.016159879,
    -0.003125483,
    0.013171316,
    -0.008620856,
    0.021014605,
    -0.022934858,
    -0.04267831,
    -0.004499749,
    -0.0060075535,
    0.011690557,
    0.026058652,
    -0.004100823,
    -0.011764933,
    -0.022515649,
    0.028479252,
    0.007640445,
    0.011244302,
    -0.0050744726,
    0.020419598,
    0.0024865253,
    0.0009778755,
    0.0052130823,
    0.012833243,
    -0.00775539,
    -0.0038202226,
    0.006399718,
    -0.0100001935,
    -0.0034753883,
    -0.038296886,
    0.020379027,
    0.00901302,
    -0.01713353,
    0.002084219,
    0.0011359246,
    0.0070116296,
    0.028993122,
    0.015172707,
    0.029804498,
    0.009729736,
    -0.013860985,
    -0.012637161,
    -0.002432434,
    0.016836025,
    -0.010547872,
    -0.005929797,
    -0.003338469,
    0.008816939,
    -0.003144077,
    0.010175991,
    -0.0045132716,
    -0.00018181978,
    -0.009668882,
    0.010236844,
    0.032887723,
    -0.016524998,
    0.013036087,
    -0.002697821,
    -0.022745539,
    0.03691755,
    -0.0014959722,
    -0.004012924,
    -0.024787497,
    -0.018215362,
    -0.015294413,
    -0.0020639345,
    0.0032285952,
    0.0070927674,
    0.011501237,
    -0.007904142,
    -0.003292829,
    0.008783131,
    -0.010919752,
    0.01852639,
    -0.020960514,
    -0.00025756922,
    -0.012278804,
    -0.0013810274,
    -0.023286454,
    -0.0021738082,
    -0.022650877,
    0.0080123255,
    0.012048914,
    -0.017579785,
    -0.005595105,
    0.0036342826,
    -0.0007450279,
    -0.01388803,
    -0.018769803,
    -0.012326134,
    -0.021798935,
    0.009580983,
    -0.011616182,
    -0.012853527,
    -0.0078094816,
    0.036241405,
    0.0035970944,
    -0.013360637,
    -0.01904026,
    0.0023851036,
    0.0020656248,
    0.10704737,
    -0.0087425625,
    0.008397728,
    0.018039564,
    0.02577467,
    -0.0065788967,
    -0.017904336,
    -0.022069393,
    0.021771887,
    -0.0140097365,
    0.0106966235,
    0.0008874411,
    -0.012150336,
    0.008857507,
    0.037269145,
    -0.0064774747,
    0.009695928,
    -0.004077158,
    0.007518739,
    -0.012109768,
    -0.038350977,
    0.029561086,
    0.013198362,
    0.039405767,
    0.0081813615,
    -0.016552044,
    0.021947686,
    -0.0024155302,
    0.016917164,
    -0.0006795263,
    -0.00095167494,
    0.016132833,
    0.0060684066,
    -0.0043171896,
    -0.004885152,
    -0.004036589,
    0.0027789583,
    -0.0010235154,
    0.02712696,
    -0.027505603,
    0.020865854,
    -0.0066296076,
    0.014226103,
    -0.018661618,
    0.007836527,
    -0.026531953,
    -0.0069507766,
    0.0014647004,
    -0.025436597,
    -0.0011781837,
    0.04127193,
    -0.0030595588,
    0.0013117224,
    -0.0112916315,
    -0.014510085,
    0.008235454,
    -0.008674948,
    0.0017664303,
    -0.028398115,
    0.007403794,
    -0.006413241,
    -0.034862068,
    0.0023445347,
    -0.0019591318,
    -0.015416119,
    -0.032319758,
    -0.012272042,
    -0.020879377,
    0.002442576,
    -0.0035024341,
    -0.0027840296,
    0.0145371305,
    -0.0131442705,
    0.0050170003,
    0.033563867,
    0.016078742,
    -0.0094727995,
    -0.0023479157,
    0.005162372,
    -0.0025980894,
    0.009411947,
    0.0028026234,
    0.007180666,
    0.0023462253,
    -0.004310428,
    0.0054226876,
    0.048087474,
    -0.017620355,
    -0.006788502,
    0.013779847,
    0.042516034,
    0.0044321343,
    0.015443166,
    0.0024273626,
    0.0070927674,
    -0.010879182,
    -0.012048914,
    0.013265977,
    -0.0074308403,
    0.0033773473,
    0.037620742,
    -0.010378835,
    -0.0011612801,
    -0.0059331777,
    0.022123484,
    0.019838111,
    0.0072753266,
    0.013942122,
    0.0016599374,
    -0.009621552,
    0.0058621825,
    -0.02823584,
    -0.0021856406,
    -0.009141488,
    0.0032438084,
    0.039405767,
    -0.0068189283,
    0.018742755,
    -0.02117688,
    -0.0046045515,
    -0.0144695155,
    -0.023245886,
    0.009161773,
    -0.0063151997,
    0.02228576,
    -0.006957538,
    -0.0043814234,
    -0.013265977,
    0.015334982,
    0.0061934935,
    0.0016261302,
    0.011487714,
    0.0022042347,
    -0.016497953,
    -0.02874971,
    -0.017471602,
    -0.0053888806,
    0.019432424,
    0.002373271,
    -0.005145468,
    -0.02823584,
    -0.0025220232,
    -0.025761148,
    0.0006799489,
    -0.016849548,
    -0.026910594,
    -0.0208929,
    -0.029966773,
    0.021163357,
    0.005753999,
    0.00096012675,
    -0.0054869214,
    -0.027938336,
    0.012366703,
    -0.0054835407,
    -0.03515957,
    -0.021190403,
    -0.0037492274,
    0.025517736,
    0.02405726,
    0.024273627,
    -0.00054345204,
    0.016051697,
    0.007681014,
    0.0034956727,
    0.006859497,
    -0.005368596,
    0.03018314,
    -0.032995906,
    0.027613787,
    0.016268063,
    0.009229387,
    0.0071130516,
    0.018215362,
    0.011764933,
    0.016741365,
    -0.0028803803,
    -0.02581524,
    -0.03145429,
    -0.024233058,
    -0.013015803,
    0.00089758326,
    -0.02294838,
    -0.0028567151,
    0.016524998,
    -0.0023293216,
    0.040974423,
    0.013847462,
    0.0019320861,
    -0.009046828,
    0.028587436,
    -0.03291477,
    0.011812263,
    -0.012630399,
    0.00049992517,
    -0.013982691,
    -0.002772197,
    0.0035396223,
    -0.0003750495,
    0.025409551,
    0.0054733986,
    0.005544394,
    -0.0020216752,
    -0.008877791,
    -0.0009280098,
    0.033077043,
    -0.006004173,
    0.0006938944,
    0.000524858,
    -0.026437292,
    0.011467429,
    0.002243113,
    -0.025842285,
    -0.02999382,
    0.009851442,
    -0.010906229,
    -0.0024341242,
    0.011670273,
    -0.012285565,
    -0.023002474,
    -0.011528282,
    -0.003952071,
    0.015159184,
    0.0010015407,
    0.02661309,
    0.016700797,
    -0.011771695,
    -0.021487907,
    0.024895681,
    -0.0324009,
    0.008898076,
    0.01063577,
    0.007146859,
    -0.0040940614,
    -0.0008625082,
    0.014334287,
    0.02470636,
    -0.021839503,
    -0.013664902,
    0.034537517,
    0.0072482806,
    0.01221119,
    -0.02127154,
    -0.007694537,
    -0.011014412,
    0.005980508,
    -0.023015996,
    -0.01810718,
    0.0046856888,
    -0.016024651,
    -0.018093657,
    0.0088237,
    -0.059933547,
    -0.007146859,
    0.019229582,
    -0.027681401,
    -0.002929401,
    -0.0016658537,
    -0.006278012,
    0.0036072368,
    -0.031887025,
    0.009161773,
    -0.037783016,
    -0.000059109916,
    0.015051001,
    -0.0010091473,
    -0.0043881848,
    0.0072685652,
    0.009979909,
    0.02127154,
    -0.020040955,
    -0.014253149,
    0.006609323,
    0.0031051987,
    0.018188316,
    0.01671432,
    -0.003199859,
    -0.013624334,
    0.011034696,
    -0.0065079015,
    0.018945599,
    0.008918361,
    0.012299089,
    -0.008384205,
    0.010703385,
    -0.008248976,
    0.0050440463,
    0.005219844,
    -0.01040588,
    -0.018932076,
    0.0052367477,
    -0.006944015,
    -0.014172012,
    0.02837107,
    0.023489298,
    -0.00089758326,
    -0.018566959,
    -0.0018712329,
    -0.023286454,
    0.021758365,
    -0.011271347,
    0.025936944,
    -0.005554536,
    -0.008208407,
    0.01110231,
    -0.0070657213,
    0.023070088,
    -0.0012229783,
    -0.014063829,
    -0.0017478364,
    0.0073361797,
    0.0047566844,
    0.017214667,
    -0.0080799395,
    0.014023259,
    0.021839503,
    -0.016930686,
    -0.02874971,
    -0.013583765,
    0.003691755,
    0.0048412024,
    0.0111564025,
    0.016741365,
    0.0043036668,
    0.0067344103,
    0.0039284057,
    0.01722819,
    -0.003691755,
    -0.029588131,
    0.025112048,
    -0.004198864,
    0.025274321,
    -0.00167177,
    -0.026247973,
    -0.03426706,
    -0.016619658,
    -0.015145661,
    0.016268063,
    0.0071265744,
    -0.014455993,
    0.013955645,
    0.045626305,
    -0.018445252,
    -0.0038100805,
    -0.0063760527,
    -0.006514663,
    -0.023705665,
    -0.0001668178,
    -0.007160382,
    -0.017850244,
    -0.004749923,
    0.035565257,
    0.0028499537,
    -0.014969863,
    -0.017147053,
    -0.01509157,
    -0.033861373,
    0.007971756,
    -0.0020554827,
    0.0024882157,
    0.030615872,
    -0.00016586696,
    0.0011993132,
    0.019702883,
    -0.006842593,
    0.0151321385,
    -0.00487501,
    -0.0004914733,
    0.012812959,
    -0.018323546,
    0.020446643,
    0.014577699,
    -0.019716406,
    0.009040067,
    0.012427556,
    -0.0036072368,
    0.012704776,
    -0.0059128935,
    -0.0001878417,
    0.019702883,
    0.0015306246,
    -0.0033198749,
    0.016186925,
    -0.004259717,
    0.004161676,
    -0.05582258,
    -0.005737095,
    0.0044828453,
    -0.012285565,
    -0.018053086,
    0.0047296383,
    0.006832451,
    0.006163067,
    0.009858203,
    0.00024594797,
    -0.021798935,
    -0.0045910287,
    -0.014591222,
    0.013103701,
    -0.008052894,
    -0.0024408856,
    0.022759061,
    0.0049426244,
    -0.0092699565,
    -0.00077714486,
    0.004712735,
    -0.0006516353,
    -0.0039994013,
    -0.0080799395,
    -0.02344873,
    0.012704776,
    -0.014875203,
    0.028073564,
    -0.030318368,
    -0.0026690848,
    -0.014226103,
    -0.033077043,
    -0.03018314,
    0.012089483,
    0.028100612,
    -0.028181748,
    -0.0018475679,
    -0.01871571,
    -0.02233985,
    0.0040230663,
    0.0014562486,
    0.008593811,
    -0.031264972,
    -0.005500444,
    0.022542695,
    -0.0053516924,
    -0.025085002,
    -0.006403099,
    0.013184839,
    0.009817634,
    0.035457075,
    0.23670505,
    0.012312612,
    -0.02354339,
    0.050332278,
    -0.0015475282,
    0.019635268,
    -0.0003338469,
    0.01374604,
    0.009134727,
    0.018783325,
    -0.03705278,
    -0.0051353257,
    0.00046442752,
    -0.004239433,
    0.02302952,
    -0.0046958313,
    -0.021988254,
    0.0017360038,
    -0.021569045,
    -0.018458774,
    0.012846766,
    -0.00090265437,
    -0.027383897,
    -0.0005307743,
    0.034889113,
    -0.0022650878,
    0.0077621513,
    0.009310525,
    -0.00099816,
    0.02256974,
    -0.001741075,
    -0.019662313,
    -0.01272506,
    0.011501237,
    -0.019337764,
    -0.010541109,
    0.0105952015,
    -0.027478557,
    0.046870414,
    0.035781626,
    -0.009662121,
    0.014307241,
    0.0063050576,
    -0.026951164,
    -0.0019625125,
    0.007403794,
    0.00005303517,
    0.0013844081,
    0.022407465,
    0.011440383,
    -0.022475079,
    -0.0124478405,
    0.045761533,
    0.011169925,
    0.009702689,
    0.002689369,
    0.007870335,
    0.005233367,
    -0.011913685,
    -0.0026133028,
    -0.018350592,
    0.03905417,
    -0.02457113,
    -0.005855421,
    -0.026870025,
    -0.002126478,
    -0.008478866,
    -0.005693146,
    0.028776756,
    -0.013468821,
    0.02837107,
    -0.01839116,
    -0.023124179,
    0.008789892,
    -0.011305154,
    0.015821807,
    0.0035328607,
    0.017471602,
    0.04519357,
    0.019243104,
    0.017782629,
    0.001955751,
    -0.008167839,
    -0.039432812,
    -0.011163164,
    -0.026640136,
    0.009215864,
    0.0014224413,
    -0.0010970462,
    0.010203037,
    0.005328027,
    -0.0005861337,
    0.0038607914,
    -0.021988254,
    0.013860985,
    0.018769803,
    0.0050000967,
    0.012873812,
    0.0020909803,
    0.0132794995,
    0.009283479,
    -0.083842054,
    0.015226799,
    -0.004161676,
    -0.023327023,
    -0.017174099,
    -0.00020210414,
    0.0031288636,
    -0.008884553,
    -0.018147748,
    0.026707752,
    -0.01235318,
    0.007018391,
    -0.0002579918,
    -0.021758365,
    0.029669268,
    -0.0070792446,
    -0.02438181,
    0.0005214773,
    -0.034564562,
    0.007403794,
    -0.024124876,
    -0.014347809,
    -0.018986167,
    0.0028634765,
    -0.017201144,
    0.0010268962,
    -0.0070724827,
    -0.010615486,
    -0.046275403,
    0.03004791,
    0.00022777655,
    0.005358454,
    0.008992736,
    -0.0051488485,
    -0.0054328297,
    -0.003728943,
    -0.0002907426,
    0.0015289342,
    0.011399815,
    0.0131916,
    -0.010838614,
    -0.008492389,
    0.01774206,
    0.0036579478,
    -0.02298895,
    0.021433815,
    -0.011115833,
    -0.026694229,
    -0.008336876,
    -0.008201646,
    0.0059669847,
    -0.017552739,
    -0.0035024341,
    0.029290628,
    -0.021433815,
    -0.040649872,
    -0.021447338,
    -0.03004791,
    0.008701994,
    -0.0094051855,
    0.0163492,
    0.023908509,
    -0.019107874,
    -0.030588826,
    0.0008215169,
    -0.17449966,
    0.010716908,
    0.0324009,
    -0.02127154,
    0.016741365,
    -0.008952168,
    0.033645004,
    0.015997605,
    -0.022556217,
    -0.00079531624,
    -0.0017934762,
    0.012015107,
    -0.03050769,
    -0.0062847733,
    0.021528475,
    0.0065214243,
    -0.004621455,
    0.016836025,
    0.016308632,
    0.004425373,
    0.013435013,
    -0.005507206,
    -0.00067318743,
    -0.021988254,
    0.008803416,
    -0.00016290882,
    0.015821807,
    0.011819025,
    0.012109768,
    0.02085233,
    -0.00390136,
    0.026856503,
    0.019811066,
    -0.0031795746,
    0.013590527,
    0.0029463044,
    -0.023462253,
    -0.021528475,
    -0.023719188,
    0.026680706,
    0.023394637,
    0.028127657,
    -0.006240824,
    0.014807588,
    -0.03361796,
    0.008445058,
    -0.0151997525,
    0.0072753266,
    -0.0023766519,
    -0.0070792446,
    0.005530871,
    -0.033834327,
    -0.001839116,
    0.0011494475,
    0.013982691,
    0.010236844,
    0.0054260683,
    0.016213972,
    0.012684491,
    0.02215053,
    -0.018512866,
    -0.016511476,
    -0.0071400977,
    0.002429053,
    -0.0032015494,
    -0.0070657213,
    -0.014280195,
    0.0076336837,
    -0.026734797,
    0.009587744,
    -0.013299784,
    -0.026166834,
    -0.015808284,
    -0.025504211,
    0.027194576,
    -0.00608531,
    -0.03432115,
    0.030318368,
    0.003404393,
    -0.002048721,
    -0.0087425625,
    0.03561935,
    -0.008803416,
    0.011305154,
    0.008803416,
    0.007992041,
    -0.021095743,
    -0.007119813,
    -0.02001391,
    -0.010453211,
    0.020446643,
    -0.03962213,
    0.0038945987,
    -0.026342632,
    0.00845182,
    0.007282088,
    -0.012603354,
    0.023894986,
    -0.0008084166,
    -0.012481648,
    -0.014239626,
    0.0070521985,
    -0.003590333,
    0.021650182,
    0.0059061316,
    0.025409551,
    0.011791979,
    0.02568001,
    0.0030308226,
    0.0074308403,
    -0.013455297,
    0.010277413,
    0.015889421,
    0.008262499,
    -0.030940423,
    0.0001670291,
    0.005328027,
    -0.016335677,
    0.013685186,
    0.0031237926,
    0.025057957,
    0.0074646473,
    -0.020635964,
    0.001992939,
    0.010703385,
    -0.029885635,
    -0.08854803,
    -0.03310409,
    0.03651186,
    0.023327023,
    -0.012224712,
    0.019026738,
    0.008262499,
    0.008445058,
    -0.004844583,
    0.024760451,
    0.009344332,
    -0.008904837,
    -0.016092265,
    -0.010378835,
    0.035781626,
    -0.015145661,
    0.02043312,
    0.00046273714,
    -0.01820184,
    0.007559308,
    -0.0075998763,
    -0.004117727,
    -0.008641141,
    0.009080635,
    -0.0019016595,
    -0.028966077,
    -0.0073023723,
    0.045301754,
    0.005071092,
    0.019513562,
    0.01774206,
    -0.002976731,
    0.020040955,
    -0.015686577,
    -0.02298895,
    -0.021582568,
    -0.02568001,
    -0.016836025,
    -0.0041954834,
    -0.030264277,
    -0.0029277105,
    -0.016362723,
    0.012103006,
    -0.033077043,
    0.010534348,
    0.0043273317,
    0.0001947088,
    0.015862375,
    -0.0132456925,
    -0.021514952,
    -0.032265667,
    0.008248976,
    -0.01495634,
    0.017890813,
    0.035781626,
    -0.0067175063,
    0.01574067,
    0.011731126,
    -0.0151321385,
    0.0028753092,
    -0.0014968173,
    -0.0047059734,
    -0.0077283443,
    0.025896376,
    -0.00022207157,
    0.01179874,
    0.0007822159,
    -0.019324241,
    -0.0041346303,
    -0.008952168,
    -0.004472703,
    0.013076656,
    -0.01663318,
    0.006565374,
    -0.03794529,
    0.005828375,
    -0.028208794,
    -0.006707364,
    -0.007883858,
    -0.012069199,
    -0.0017131839,
    -0.009026543,
    0.011000888,
    0.007444363,
    0.011311916,
    0.0037255622,
    0.032860678,
    0.015483734,
    0.0011502927,
    -0.021339156,
    0.012312612,
    0.017268758,
    0.025003863,
    -0.01342149,
    -0.020216754,
    -0.0072009508,
    0.0054632565,
    -0.00035518775,
    0.0169983,
    -0.003941929,
    -0.03172475,
    -0.0047059734,
    -0.068750486,
    0.012589831,
    0.0326984,
    0.010649293,
    0.008904837,
    -0.002721486,
    -0.0044422764,
    0.0011063432,
    -0.020676533,
    -0.008661425,
    -0.015037478,
    -0.014361332,
    0.008309829,
    -0.007018391,
    -0.03491616,
    -0.021393247,
    0.009087397,
    0.005395642,
    0.02856039,
    -0.0029378526,
    -0.019729929,
    0.019121397,
    -0.011251063,
    -0.0013413038,
    -0.0075863535,
    0.020176185,
    -0.003701897,
    0.009722973,
    0.0043307124,
    -0.021704273,
    0.033185225,
    -0.012941427,
    -0.005726953,
    0.03929758,
    -0.031643614,
    -0.025788194,
    0.0050541884,
    0.027316282,
    0.022975428,
    0.0056965267,
    -0.0081746,
    -0.021163357,
    -0.008722278,
    -0.007951472,
    -0.0140097365,
    0.012853527,
    0.00070995284,
    0.019445946,
    0.03037246,
    0.014564176,
    -0.020135615,
    0.018688664,
    0.0031880264,
    0.0072685652,
    0.0078094816,
    -0.025193185,
    -0.0085735265,
    -0.0053821187,
    0.0023749615,
    -0.02066301,
    0.010831852,
    0.013969168,
    0.021163357,
    0.0015897873,
    0.022218144,
    0.01694421,
    -0.03975736,
    0.0025220232,
    0.010189514,
    -0.02081176,
    -0.022028824,
    0.011562089,
    0.011237539,
    0.020000387,
    0.023381114,
    -0.04689746,
    0.006676938,
    0.002745151,
    -0.010453211,
    0.014564176,
    0.021907117,
    0.006298296,
    -0.037323236,
    0.010013716,
    0.005344931,
    0.028344024,
    0.0018374256,
    0.026924118,
    -0.0044896067,
    0.012157097,
    0.0068459744,
    -0.004996716,
    0.025166139,
    -0.007917665,
    -0.0202438,
    0.029263582,
    0.016741365,
    -0.00887103,
    -0.013556719,
    0.027248668,
    -0.014848157,
    -0.00020474533,
    0.0018965884,
    -0.004138011,
    -0.03683641,
    0.035565257,
    -0.009276718,
    -0.04457152,
    0.0026690848,
    -0.0039385483,
    0.00264711,
    0.008843984,
    0.0008646212,
    0.029290628,
    -0.005858802,
    0.00057176565,
    0.018012518,
    -0.004374662,
    -0.009357855,
    0.0078094816,
    0.017904336,
    0.012420795,
    -0.0032725446,
    -0.01081833,
    0.018093657,
    0.01230585,
    -0.013272738,
    -0.0025270942,
    0.03153543,
    -0.00106831,
    -0.011528282,
    -0.008323352,
    -0.006511282,
    -0.010284174,
    -0.022691445,
    0.004290144,
    -0.0055342517,
    0.025950467,
    -0.02169075,
    0.055930763,
    0.0073091337,
    -0.0021754985,
    0.010737192,
    -0.016416814,
    0.038161658,
    -0.0036173789,
    0.014834634,
    -0.017187621,
    -0.008458582,
    0.010933274,
    -0.0009187128,
    0.012204428,
    -0.017998995,
    -0.028939031,
    -0.008904837,
    -0.009493084,
    0.01444247,
    -0.040839195,
    -0.011785218,
    0.027045824,
    0.010453211,
    0.019297196,
    0.001625285,
    0.0030392744,
    -0.019256627,
    0.020392552,
    0.0007192499,
    -0.007498455,
    -0.041298974,
    -0.015294413,
    0.023110656,
    -0.038242795,
    -0.015957035,
    0.016213972,
    -0.025504211,
    -0.0062442045,
    -0.010933274,
    -0.011670273,
    0.025274321,
    0.0113592455,
    -0.018742755,
    -0.03050769,
    -0.026734797,
    0.04681632,
    0.0018171413,
    -0.0151997525,
    0.0021535237,
    -0.034212966,
  ];
  //await generateEmbeddings(search);
  const acts = await searchCosineSimilarity(searchEmbeddings);
  return acts;
};
