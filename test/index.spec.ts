import { LinkType, attributes, choiceColumn, fetchxml, filterAnd, idColumn, linkEntity, linkEntitySimple, orderBy } from '../src/index';
const vkbeautify = require('vkbeautify');

describe('Index', () => {
    it('should create a ColumnOperator instance', () => {
        let xml = fetchxml({ entity: "contact" },
            attributes("fullname"),
            filterAnd(idColumn('leadid').equalTo('8788facf-828e-4333-8405-b825b0f29ea0'), choiceColumn('statecode').equalTo(0)),
            linkEntitySimple("contact", LinkType.LEFT, "emailaddress1", "emailaddress1", '', attributes("fullname")),
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
                    <link-entity name='undefined' link-type='outer' to='undefined' from='undefined'>outer emailaddress1 emailaddress1
                        <attribute name='fullname'/>
                    </link-entity>
                    <order attribute='createdon' descending='true'/>
                </entity>
            </fetch>`))
    });
});
