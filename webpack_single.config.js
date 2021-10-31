/**
 * command for run single infoblock build:
 *   npx webpack --config=webpack_single.config.js --names=infoblockname1,infoblockname2
 *
 * for production build:
 *   npx webpack --config=webpack_single.config.js --names=infoblockname -p
 *   parameter --no-analize for production build without bundle analize
 *   parameter --copy
 */
const path = require("path");
const fs = require("fs");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const infoBlocks = {
    postfilterib_v2: ["./postFilterSourceCoreVer2.js"],
    addressinput: ["./AddressInput.js"],
    addressshow: ["./AddressShow.js"],
    agreements: ["./components/etd/Agreements.js"],
    asterplotinfoblock: ["./AsterPlotIB.js"],
    barchartcomplex: ["./BarChartComplexInfoBlock.js"],
    barchartsimple: ["./BarChartSimpleInfoBlock.js"],
    bbib: ["./BBIb.js"],
    budgetstructureig: ["./BudgetStructureIG.js"],
    budgetstructureshort: ["./BudgetStructureShort.js"],
    calendarib: ["./CalendarInfoBlock.js"],
    catalogib: ["./CatalogIB.js"],
    chartbuilder: ["./ChartBuilder.js"],
    crtpopup: ["./CrtPopup.js"],
    dashboardib: ["./Dashboard.js"],
    etd: ["./components/etd/Adapter.js"],
    expensesIG: ["./expensesIG.js"],
    fileinfoblock: ["./FileIB.js"],
    filter_source: ["./FilterSource.js"],
    flat_filter_core: ["./FlatFilterSourceCore.js"],
    flat_filter_source: ["./FlatFilterSourceIB.js"],
    feedbackib: ["./FeedbackIB.js"],
    gis_map: ["./GisMapIB.js"],
    glossaryinfoblock: ["./GlossaryIB.js"],
    gossprograminfoblock: ["./ProgramsExecutionContainerIB.js"],
    hbarchartib: ["./HBarChartIB.js"],
    hfilterib: ["./HFilterIB.js"],
    htmltextinfoblock: ["./HtmlTextIB.js"],
    ib_mainpagestat: ["./MainPageStat.js"],
    ib_mpcs: ["./ib_MainPageInicCatSlieder.js"],
    ib_sorting: ["./SortingIB.js"],
    ibcustomfiles: ["./InicFiles.js"],
    ibgal: ["./IBGal.js"],
    ibvoteprocess: ["./VoteProcess.js"],
    indicatorsib: ["./IndicatorsIB.js"],
    initiatives_manage: ["./IniciativeManage.js"],
    interviewinfoblock: ["./InterviewIB.js"],
    interviews_adm: ["./InterviewsAdm.js"],
    joinsource: ["./components/ProxySource/JSAdapter.js"],
    loader: ["./Loader.js"],
    mapib: ["./MapIB.js"],
    modal_notification: ["./PopupNotification.js"],
    mpinfografic: ["./MPInfografic.js"],
    pmanage: ["./ProfesiogramsManage.js"],
    popupib: ["./PopupIB.js"],
    popup_multiple_confirm: ["./PopupMultipleConfirm.js"],
    postfilterib: ["./PostFilterIB.js"],
    proftestinfoblock: ["./ProfTestIB.js"],
    programmescontainerib: ["./ProgrammesContainerIB.js"],
    refreshercoursesib: ["./RefresherCoursesIB.js"],
    slider: ["./SliderIB.js"],
    sunburstinfoblock: ["./SunburstIB.js"],
    tableinfoblock: ["./TableIB.js"],
    userib: ["./UserIB.js"],
    vote_result: ["./VoteResult.js"],
    vpmanage: ["./vpManage.js"],
    zmap_amur: ["./DistrictsCompareContainerIB_amur.js"],
    zmap_bel: ["./DistrictsCompareContainerIB_belgorod.js"],
    zmap_cho: ["./DistrictsCompareContainerIB_cho.js"],
    zmap_lo: ["./DistrictsCompareContainerIB_lo.js"],
    zmap: ["./DistrictsCompareContainerIB.js"],
    zrusmap: ["./DistrictsCompareContainerIB_rus.js"],
    paginationib: ["./Pagination.js"],
};

const pathInResources = {
    asterplotinfoblock: "sun/default",
    barchartcomplex: "histogram_grouping/default",
    barchartsimple: "bar_chart/default",
    budgetstructureig: "budgetstructureig/default",
    budgetstructureshort: "budgetstructureshort/default",
    calendarib: "calendar/default",
    catalogib: "catalog",
    chartbuilder: "constructor/default",
    crtpopup: ["crt"],
    dashboardib: "dashboard/default",
    expensesIG: "expenses_ig/default",
    filter_source: "filter/default",
    flat_filter_source: "flat_filter/default",
    gis_map: "gis_map/default",
    glossaryinfoblock: "glossary/default",
    gossprograminfoblock: "gossprogramms/default",
    hbarchartib: "hbar/default",
    hfilterib: "hfilter/default",
    htmltextinfoblock: "html_template/default",
    ib_sorting: "ib_sorting",
    indicatorsib: "indicators/default",
    interviewinfoblock: "interview",
    mapib: "map/default",
    modal_notification: ["modal_notification/default"],
    mpinfografic: "mpinfografic/default",
    popupib: ["modal/default"],
    popup_multiple_confirm: ["modal/multiple_confirm"],
    postfilterib: "postfilter/default",
    proftestinfoblock: "proftest/default",
    programmescontainerib: "mpgosprogramms/default",
    refreshercoursesib: "refreshercourses/default",
    slider: "slider/default",
    switchib: "switch/default",
    tableinfoblock: "table/default",
    userib: ["user"],
    paginationib: ["pagination"],
};

let names = {};
let entry = infoBlocks;
const isProduction = process.argv.indexOf("-p") !== -1;
const noAnalize = process.argv.indexOf("--no-analize") !== -1;
const copyAfterBuild = process.argv.indexOf("--copy") !== -1;
const isNamed = process.argv.findIndex(el => el.indexOf("--names") !== -1) !== -1;
let infoblockNames = process.argv.find(el => el.indexOf("--names") !== -1);

if (infoblockNames) {
    infoblockNames = infoblockNames.split("=")[1];

    infoblockNames.split(",").forEach(name => {
        console.log(infoBlocks[name]);
        if (infoBlocks[name] !== undefined) {
            names[name] = infoBlocks[name];
            return;
        }
        console.log(`Infoblock ${name} isn't defined`);
    });
    if (Object.keys(names).length === 0) throw new Error(`Infoblock names aren't in Infoblocks object`);
    entry = names;
}

// if (infoBlocks[infoBlock] === undefined) throw new Error(`Infoblock ${infoBlock} isn't defined`);

console.log(`Running webpack in ${isProduction ? "production" : "development"} mode.`);
console.log(`Building ${Object.keys(names).join(" & ")}`);
if (isProduction && !noAnalize) console.log("Run bundle Analizer after build");
if (copyAfterBuild && isNamed) console.log("Copy after build");

const config = {
    context: path.resolve(__dirname, "./src"),
    entry: entry,
    devtool: isProduction ? false : "inline-source-map",
    mode: isProduction ? "production" : "development",
    output: {
        path: path.resolve(__dirname, "./js"),
        filename: "[name].js",
        publicPath: "/assets/main-theme/js/",
    },
    optimization: {
        usedExports: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                // чтобы модули тоже обрабатывались babel иначе код не работате в IE11
                // exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
            },
            {
                test: /tinymce[\\/]skins[\\/]/,
                loader: "file?name=[path][name].[ext]&context=node_modules/tinymce",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    fix: true,
                },
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/,
                loader: "svg-inline-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.twig$/,
                loader: "twig-loader",
                exclude: /node_modules/,
            },
        ],
    },
};

config.plugins = [
    new CleanWebpackPlugin(),
];

// если запушена продуктовая сборка и не указан параметр --no-analize - запускаем BundleAnalyzerPlugin после сборки
if (isProduction && !noAnalize) config.plugins.push(new BundleAnalyzerPlugin());

/* если запущена продуктовая сборка и указаны параметры --names и --copy, после сборки копируем
 * файлы указанные в --names в ../bft-portal-platform-web/site-resources/infoblocks/
 */
if (copyAfterBuild && isNamed) {
    config.plugins.push({
        apply: (compiler) => {
            // используем webpack compilerHook done. Который запускается после работы compiler
            compiler.hooks.done.tapAsync("CopyFilesToResources", (params, callback) => {
                callback();
                // в цикле копируем все инфоблоки переданные в --names
                Object.keys(entry).forEach(name => {
                    let infoblockPaths = pathInResources[name];

                    if (!infoblockPaths) {
                        console.log(`нет пути в ресурсах для ${name}`);
                        return;
                    }

                    infoblockPaths = Array.isArray(infoblockPaths) ? infoblockPaths : [infoblockPaths];

                    infoblockPaths.forEach(path => {
                        const inputPath = `./js/${name}.js`;
                        const outputPath = `./dest-site-resources/infoblocks/${path}/${name}.js`;

                        // проверяем, что bundle создан.
                        fs.access(inputPath, fs.constants.R_OK, (err) => {
                            if (err) {
                                console.log(`${name} "is not readable"`);
                                return;
                            }
                            // копируем в репозиторий web
                            fs.copyFile(inputPath, outputPath, (err) => {
                                if (err) console.log(`error when copied ${name}:`, err);
                                if (!err) console.log(`${name}.js was copied to ${outputPath}`);
                            });
                        });
                    })
                });
            });
        },
    });
}

module.exports = config;
