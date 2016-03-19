# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class NbaOddsItem(scrapy.Item):
    date_time = scrapy.Field()
    home_team = scrapy.Field()
    away_team = scrapy.Field()
    score_home = scrapy.Field()
    score_away = scrapy.Field()
    overtime = scrapy.Field()
    odd_home = scrapy.Field()
    odd_away = scrapy.Field()
    # available_bookmaker_odds = scrapy.Field()
