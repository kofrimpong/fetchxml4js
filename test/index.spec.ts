import { LinkType, attributes, choiceColumn, fetchxml, filterAnd, idColumn, linkEntity, linkEntitySimple, orderBy } from '../src/index';
const vkbeautify = require('vkbeautify');

describe('Index', () => {
    it('Link entity example', () => {
        let xml = fetchxml({ entity: "contact" },
            attributes("fullname"),
            filterAnd(idColumn('leadid').equalTo('8788facf-828e-4333-8405-b825b0f29ea0'), choiceColumn('statecode').equalTo(0)),
            linkEntitySimple("lead", LinkType.LEFT, "emailaddress1", "emailaddress1", '', attributes("fullname")),
            orderBy({ logicalName: "createdon", desc: true })
        );
        expect(vkbeautify.xml(xml)).toEqual(vkbeautify.xml(
            `<fetch>
            <entity name='contact'>
                <attribute name='fullname'/>
                <filter type='and'>
                    <condition attribute='leadid' operator='eq' value='8788facf-828e-4333-8405-b825b0f29ea0' />
                    <condition attribute='statecode' operator='eq' value='0' />
                </filter>
                <link-entity name='lead' link-type='outer' to='emailaddress1' from='emailaddress1'>
                    <attribute name='fullname'/>
                </link-entity>
                <order attribute='createdon' descending='true'/>
            </entity>
        </fetch>`))
    });
});
