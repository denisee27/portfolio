import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart, Legend, Colors, Tooltip, ArcElement, PieController, BarController, CategoryScale, LinearScale, BarElement, ChartData, LineController, PointElement, LineElement, DoughnutController } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-dashboard-management',
    templateUrl: './dashboard-management.component.html',
    styleUrls: ['./dashboard-management.component.scss']
})
export class DashboardManagementComponent implements OnInit, AfterViewInit {
    constructor(
        public loading: LoadingService,
        private modalService: NgbModal,
        private http: HttpService,
    ) {
        this.loading.start();
        Chart.register(
            ChartDataLabels,
            Colors,
            Legend,
            Tooltip,
            PieController,
            ArcElement,
            BarController,
            CategoryScale,
            LinearScale,
            BarElement,
            DoughnutController,
            LineController,
            LineElement,
            PointElement,
        );
    }
    @ViewChild('calendarModal') calendarModal!: ElementRef;
    @ViewChild('transactionChart') transactionChart!: ElementRef;
    @ViewChild('absenceProgress') absenceProgress!: ElementRef;
    private apiPath = 'dashboard/finance';
    pieAmountChart!: any;
    pieQtyChart!: any;
    barChart!: any;
    companyList: any[] = [];
    classList: any[] = [];
    subClassList: any[] = [];
    topLoading = true;
    data: any = [];
    count: any = {};
    charts: any[] = [];
    className = '';
    chartLoading = true;
    date_range: any = { start: moment().subtract(29, 'days'), end: moment() };
    selectedDate: string = this.date_range.start.format('DD MMM YYYY') + ' - ' + this.date_range.end.format('DD MMM YYYY');
    query: any = {
        from: this.date_range.start.format('YYYY-MM-DD'),
        to: this.date_range.end.format('YYYY-MM-DD'),
        company_id: '',
        po_type: '',
        status: '',
        class: '',
        subClass: ''
    };
    ranges: any = {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    };
    calendarDialog: any = {
        modal: null,
        show: () => {
            this.calendarDialog.modal = this.modalService.open(this.calendarModal, { keyboard: false, backdrop: 'static', centered: true, size: 'lg', windowClass: 'modal-transparent' });
        },
        submit: (ev: any) => {
            this.date_range.start = ev.startDate;
            this.date_range.end = ev.endDate;
            this.selectedDate = ev.startDate.format('DD MMM YYYY') + ' - ' + ev.endDate.format('DD MMM YYYY');
            this.query.from = ev.startDate.format('YYYY-MM-DD');
            this.query.to = ev.endDate.format('YYYY-MM-DD');
            this.calendarDialog.modal.close();
            this.getData();
        },
        cancel: () => {
            this.calendarDialog.modal.close();
            this.date_range = { start: moment().subtract(29, 'days'), end: moment() };
            this.selectedDate = this.date_range.start.format('DD MMM YYYY') + ' - ' + this.date_range.end.format('DD MMM YYYY');
            this.query.from = this.date_range.start.format('YYYY-MM-DD');
            this.query.to = this.date_range.end.format('YYYY-MM-DD');
            this.getData();
        }
    };
    barOptons: any = {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                formatter: (value: number, ctx: any) => {
                    const datapoints = ctx.chart.data.datasets[0].data
                    const total = datapoints.reduce((t: number, d: number) => Number(t) + Number(d), 0)
                    if (!total) return 0;
                    const percentage = value / Number(total) * 100;
                    return percentage.toFixed(2) + "%";
                },
                color: '#000'
            }
        }
    };

    async getCompany(): Promise<void> {
        const r = await this.http.Get('companies', { forceView: true });
        this.companyList = r.response?.result?.data || [];
    }

    async getClass(): Promise<void> {
        const r = await this.http.Get('categories', { forceView: true });
        this.classList = r.response?.result?.data || [];
    }

    async getFirstDate(): Promise<void> {
        const r = await this.http.Get('categories', { forceView: true });
        this.classList = r.response?.result?.data || [];
    }

    async getSubClass(): Promise<void> {
        const r = await this.http.Get('sub-categories', { forceView: true });
        this.subClassList = r.response?.result?.data || [];
    }



    async getName(id?: String) {
        if (id == '') {
            this.className = '';
            return;
        }
        let dataClass = this.classList.findIndex((e: any) => {
            return e.id == id;
        })
        this.className = this.classList[dataClass].name;
    }

    getDefaultData() {
        return {
            "transaction": [
                {
                    "name": "SP Bandung",
                    "data": [
                        {
                            "name": "SP Bandung",
                            "project": "MS IBS 2023",
                            "total" : 20,
                        }
                    ]
                },
                {
                    "name": "SP Bangil",
                    "data": [
                        {
                            "name": "SP Bangil",
                            "project": "MS IBS 2023",
                            "total" : 25,
                        }
                    ]
                },
            ],    
            "out": [
                {
                    "name": "Jakarta",
                    "data": [
                        {
                            "qty": 50,
                            "category": "Keamanan",
                        },
                        {
                            "qty": 10,
                            "category": "Kebersihan",
                        },
                        {
                            "qty": 25,
                            "category": "Staff",
                        }
                    ]
                },
                {
                    "name": "Bandung",
                    "data": [
                        {
                            "qty": 28,
                            "category": "Kebersihan",
                        },
                        {
                            "qty": 20,
                            "category": "Keamanan",
                        },
                        {
                            "qty": 9,
                            "category": "Staff",
                        }
                    ]
                },
                {
                    "name": "Medan",
                    "data": [
                        {
                            "qty": 15,
                            "category": "Kebersihan",
                        },
                        {
                            "qty": 30,
                            "category": "Keamanan",
                        },
                        {
                            "qty": 8,
                            "category": "Staff",
                        }
                    ]
                },
            ],
        }
    }
    async getData(sort?: string): Promise<void> {
        delete this.query.orderBy
        delete this.query.topOnly
        if (sort) {
            this.topLoading = true;
            this.query.topOnly = true;
            this.query.orderBy = sort;
        }
        this.chartLoading = true;
        const r = await this.http.Get(this.apiPath, this.query);
        this.chartLoading = false;
        this.data = r.response?.result || {};
        this.data = this.getDefaultData() || {};
        this.charts.forEach(e => {
            e?.destroy();
        });
        let barData: ChartData<'bar'> = { labels: [], datasets: [{ data: [] }] };
        (this.data.transaction || []).forEach((e: any) => {
            barData.labels?.push(e.name);
            e.data?.forEach((d: any) => {
                    barData.datasets[0].data.push(d.total);
            });
        });
        this.charts.push(new Chart(this.transactionChart.nativeElement, {
            type: 'bar',
            data: barData,
            options: {
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }));

        let outData: ChartData<'line'> = { labels: [], datasets: [] };
        (this.data.out || []).forEach((e: any) => {
            outData.labels?.push(e.name);
            e.data?.forEach((d: any) => {
                if (!outData.datasets.filter((x: any) => x.label == d.category).length) {
                    const xt = d.uom == 'meters' || d.uom == 'm' ? 'y1' : 'y';
                    outData.datasets.push({
                        type: 'line',
                        label: d.category,
                        data: [],
                        yAxisID: xt
                    });
                }
            });
        });
        outData.labels?.forEach((e: any) => {
            const tx = this.data.out?.filter((x: any) => x.name == e);
            if (tx.length) {
                outData.datasets.forEach((d: any) => {
                    const dt = tx[0].data?.filter((x: any) => x.category == d.label);
                    if (dt.length) {
                        d.data.push(Number(dt[0].qty));
                    }
                });
            }
        });
        this.charts.push(new Chart(this.absenceProgress.nativeElement, {
            type: 'line',
            data: outData,
            options: {
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        }
                    }
                }
            }
        }));
        this.topLoading = false;
    }


    ngOnInit(): void {
        this.getFirstDate();
        this.getCompany();
        this.getClass();
        this.getSubClass();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getData();
        }, 500);
    }

}
