# coding=utf-8
import json

import scrapy
from scrapy.http.headers import Headers

RENDER_HTML_URL = "http://localhost:8050/render.html"

from nba_odds.items import NbaOddsItem

import datetime

class NbaSpider(scrapy.Spider):
    name = "nba"
    allowed_domains = ["oddsportal.com"]
    # Valeurs pour 2014 - 2015
    # number_pages = 29
    # start_url = "http://www.oddsportal.com/basketball/usa/nba-2014-2015/results/#/page/"

    # Valeurs pour 2013-2014
    number_pages = 28 #29
    start_url ="http://www.oddsportal.com/basketball/usa/nba-2008-2009/results/#/page/"
    start_urls=[]
    for x in range(1, number_pages):
        start_urls.append(start_url + str(x))

    def start_requests(self):
        for url in self.start_urls:
            body = json.dumps({"url": url, "wait": 2}) # car le splash on docker me dit que la page met 1.42 seconde à se charger donc j attends 1.5
            headers = Headers({'Content-Type': 'application/json'})

            yield scrapy.Request(RENDER_HTML_URL, self.parse, method="POST",
                                 body=body, headers=headers)

    def parse(self, response):
        # filename = response.url.split("/")[-2] + '.html'
        # with open(filename, 'wb') as f:
        #     f.write(response.body)
        # dates = response.xpath("//*[@class='nob-border']/th/span/text()")

        games = response.xpath("//tr[contains(@class,'deactivate')]")

        # for date in dates:
        #     item = NbaOddsItem()
        #     item["date"]=date
        #     yield item

        for game in games:
            print game
            item = NbaOddsItem()
            hyphen = game.xpath("td[contains(@class,'table-participant')]/a/text()").extract()[0]
            no_hyphen=game.xpath("td[contains(@class,'table-participant')]/a/span/text()").extract()[0]
            hyphen_cleaned = hyphen.strip()
            if hyphen_cleaned.split()[0]=='-':
                item["home_team"] = no_hyphen
                item["away_team"] = hyphen_cleaned.strip("-").strip()
            else:
                item["away_team"] = no_hyphen
                item["home_team"] = hyphen_cleaned.strip("-").strip()

            score=game.xpath("td[contains(@class,'table-score')]/text()").extract()[0]
            tmp = score.split()
            if len(tmp)>1:
                item["overtime"]=True
            else: item["overtime"]=False
            scores=map(int,tmp[0].split(":"))

            # item["score_winner"]=max(scores)
            # item["score_looser"]=min(scores)
            item["score_home"]=scores[0]
            item["score_away"]=scores[1]

            # item["odd_winner"]=float(game.xpath("td[@class='result-ok odds-nowrp']/a/text()").extract()[0])
            # item["odd_looser"]=float(game.xpath("td[@class='odds-nowrp']/a/text()").extract()[0])
            item["odd_home"]=float(game.xpath("td[contains(@class,'odds-nowrp')]/a/text()").extract()[0])
            item["odd_away"]=float(game.xpath("td[contains(@class,'odds-nowrp')]/a/text()").extract()[1])

            # item["available_bookmaker_odds"]=int(game.xpath("td[contains(@class,'info-value')]/text()").extract()[0])
            t = game.xpath("td[contains(@class,'table-time')]/text()").extract()[0]
            d = game.xpath("preceding::tr[contains(@class,'nob-border')][1]/th/span/text()").extract()[0]
            date_time = datetime.datetime.strptime(d + " " + t,"%d %b %Y %H:%M")
            #parce que les données sont en GMT-1 et qu'on les veut à l'heure de paris
            date_time += datetime.timedelta(0,0,0,0,0,2) # datetime.timedelta([days[, seconds[, microseconds[, milliseconds[, minutes[, hours[, weeks]]]]]]])
            item["date_time"] = date_time
            yield item
