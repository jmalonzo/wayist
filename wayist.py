#! /usr/bin/env python
# Copyright (c) 2014, Jan Michael C Alonzo
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
#
# 1. Redistributions of source code must retain the above copyright
# notice, this list of conditions and the following disclaimer.
#
# 2. Redistributions in binary form must reproduce the above copyright
# notice, this list of conditions and the following disclaimer in the
# documentation and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
# FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
# COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
# INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
# BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
# LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
# ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.

import argparse
import collections
import json
import os
import os.path
import sys
import lxml.html as lh

DATA_DIR = "data"
EXCLUDE_DIRS = ['_borders']
EXCLUDE_FILES = ['all_translations.htm', 'index.htm', 'indexchp.htm']
EXTENSION = ".json"
AUTHORS = "authors"
CHAPTERS = "chapters"

def is_float(s):
    try:
        float(s)
        return True
    except (TypeError, ValueError):
        pass

    return False

def parse_chapter(filename):
    with open(filename, "rb") as fn:
        document = lh.parse(fn)
        table = document.find("body").findall("table")[1]
        sections = table.cssselect("tr table")
        chapter_content = []
        for sdx, section in enumerate(sections):
            sxn_author_content = dict()
            for idx, child in enumerate(section.iterchildren()):
                author = child.cssselect("tr td:first-of-type strong")[0].text
                if idx == 0:
                    # Chapter/section header
                    continue

                text = child.cssselect("tr td:last-of-type")[0].text
                sxn_author_content[author] = text
            chapter_content.append({"section": sdx + 1, "content": sxn_author_content})
        return chapter_content

def parse(filename):
    # FIXME, use lxml api to parse, maybe.
    author_content = dict()
    with open(filename, "rb") as fn:
        document = lh.parse(fn)
        table = document.find("body").findall("table")[1]
        content = unicode(table.xpath('string()'))
        start = 0
        try:
            start = content.index("1.1")
        except ValueError:
            try:
                # Rosenberg translation
                start = content.index("1.")
            except ValueError:
                if "Chapter 1" in content:
                    # Gibbs translation
                    start = content.index("Chapter 1")
                else:
                    # Feng translation!
                    start = content.index("1")

        content = unicode(content[start:])
        chap, verse = '', ''
        for line in content.splitlines():
            if not line or not len(line.strip()):
                continue

            if line.startswith("Chapter"):
                # Deal with the Gibbs translation
                line = line.partition(' ')[2]

            if not is_float(line.partition(' ')[0]):
                author_content[chap] += " " + line
            else:
                chap, _, verse = line.partition(' ')
                chap = unicode(abs(float(chap)))
                author_content[chap] = verse

    return collections.OrderedDict(sorted(author_content.items(),
                                          key=lambda x: float(x[0])))


def main():
    parser = argparse.ArgumentParser(description="Parse wayist.org html")
    parser.add_argument('--site', dest='site', default='', help='location of html files to parse')

    args = parser.parse_args()
    if not args.site:
        raise parser.error("Please specify location of html files")

    authors = collections.OrderedDict()
    chapters = collections.OrderedDict()
    for root, dirs, files in os.walk(args.site):
        current_dir = root.split('/')
        if current_dir[len(current_dir) - 1] in EXCLUDE_DIRS:
            continue

        for f in files:
            if f in EXCLUDE_FILES:
                continue

            filename = os.path.join(root, f)
            name = f.split('.')[0]
            if not f.startswith('chap'):
                authors[name] = parse(filename)
            else:
                content = parse_chapter(filename)
                chapters[name] = content

    # Write out the authors
    with open(os.path.join(DATA_DIR, AUTHORS + EXTENSION), 'wb') as f:
        f.write(json.dumps(authors.keys()))

    # .. and the chapters
    with open(os.path.join(DATA_DIR, CHAPTERS + EXTENSION), 'wb') as f:
        f.write(json.dumps(chapters.keys()))

    # For optimization purposes, each author translation of the book
    # is written out to a separate file, loaded when that translation
    # is selected, and cached for future access to that version.
    for author in authors:
        with open(os.path.join(DATA_DIR, author + EXTENSION), 'wb') as f:
            f.write(json.dumps([authors.get(author)]))

    for chapter in chapters:
        with open(os.path.join(DATA_DIR, chapter + EXTENSION), 'wb') as f:
            f.write(json.dumps(chapters.get(chapter)))

    print >> sys.stdout, "Processed %s authors, %s chapters" % (len(authors.keys()), len(chapters.keys()))

if __name__ == '__main__':
    main()
